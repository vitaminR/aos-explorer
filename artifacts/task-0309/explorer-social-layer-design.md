# aOS7 Explorer Social Layer Architecture Design Document

**Task ID:** task-0309  
**Author:** gemini-2 (Squad-Worker / Architect)  
**Date:** 2026-08-02  
**Target System:** `7.aOS-Explorer` (Static Firebase Hosting + Firestore / Cloud Functions)  
**Verification Contract:** v1  

---

## 1. Executive Summary & Goals

This document designs the social layer for the **aOS7 Explorer** website (`7.aOS-Explorer`). The objective is to make the static Explorer site social, engaging, and community-driven without compromising its static-first speed, strict security posture, accessibility compliance (WCAG 2.1 AA / Section 508), or zero-PII privacy guarantees.

### Key Capabilities Designed:
1. **User Authentication:** Privacy-minimal Firebase Auth (email/password & passwordless magic link; Google OAuth optional; zero extraneous PII).
2. **Bookmarks & Saved Stacks:** Personal collection storage in Cloud Firestore allowing users to bookmark tools, strata picks, and custom stack configurations.
3. **Contribution & Moderation Pipeline:** Propose-a-tool and edit-suggestion workflow backed by Firestore and Cloud Functions, featuring a mandatory review queue so no community submission publishes unvetted.
4. **Return-Visit & Engagement Hooks:** Public activity feed of approved community contributions, star/upvote counters, and personal saved item dashboards (strictly avoiding manipulative dark patterns).
5. **Build Slicing:** Clear implementation roadmap mapping directly to tasks `0310` (Accounts & Saves), `0311` (Contributions & Moderation), and `0312` (Return Hooks).

---

## 2. Architecture Overview & Static-First Principles

The existing Explorer is hosted on Firebase Hosting as a fast, static Next.js web application. The social layer extends this architecture with dynamic client-side Firebase SDK integrations while preserving static page performance.

```
+--------------------------------------------------------------------+
|                         aOS7 Explorer CDN                          |
|                   (Firebase Hosting / Next.js SSG)                 |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
|                       Client Browser Runtime                        |
|                                                                    |
|  +------------------+   +-------------------+  +----------------+  |
|  |  Firebase Auth   |   | Firestore SDK     |  | WCAG AA UI     |  |
|  | (Anon/Email/OAuth|   | (Offline Cache)   |  | (shadcn/Radix) |  |
|  +------------------+   +-------------------+  +----------------+  |
+--------------------------------------------------------------------+
           |                        |                    |
           v                        v                    v
+--------------------+   +---------------------+   +-----------------+
| Firebase Auth Svc  |   | Cloud Firestore DB  |   | Cloud Functions |
| (Sovereign Ally)   |   | (Default-Deny Rules)|   | (Mod / Webhooks)|
+--------------------+   +---------------------+   +-----------------+
```

### Serverless Shift Rationale:
- **Firebase Hosting (Static HTML/JS):** Remains the primary delivery channel for all tool catalog pages.
- **Cloud Firestore:** Serves user bookmarks (`/users/{uid}/saves`), tool upvotes (`/tool_stats/{toolId}`), and pending submissions (`/submissions/{subId}`).
- **Cloud Functions (Node.js 20):** Enforces backend validation, sanitizes submissions against XSS/injections, and handles administrative moderation actions.

---

## 3. Authentication & Privacy Strategy

### Auth Mechanism:
- **Primary Provider:** Firebase Auth (Email/Password + Passwordless Magic Link).
- **Secondary Provider:** Google OAuth (optional 1-click login).
- **Ally-Only Compliance:** Firebase Auth infrastructure is hosted entirely within Google Cloud US regions (`us-central1`), meeting all ally-only policy requirements. Chinese-origin SSO providers or telemetry integrations are strictly prohibited.

### Privacy Minimal (Zero-PII Rail):
- Only `uid`, `email`, and `createdAt` are captured.
- No real names, avatars, phone numbers, or demographic data collected.
- Any request to collect personal data beyond email is flagged **FOUNDER DECISION**.

---

## 4. Cloud Firestore Data Model

### Collection: `/users/{uid}`
```json
{
  "uid": "usr_98a7f1b2c",
  "email": "user@example.com",
  "createdAt": "2026-08-02T02:30:00Z",
  "updatedAt": "2026-08-02T02:30:00Z"
}
```

### Subcollection: `/users/{uid}/saves/{saveId}`
```json
{
  "saveId": "save_tool_litellm",
  "itemType": "tool",
  "itemId": "litellm-proxy",
  "stratum": "L1",
  "notes": "Primary gateway pick for cost tracking",
  "savedAt": "2026-08-02T02:32:00Z"
}
```

### Collection: `/submissions/{subId}`
```json
{
  "subId": "sub_20260802_001",
  "submittedByUid": "usr_98a7f1b2c",
  "submissionType": "suggest_tool",
  "toolData": {
    "name": "Nomic Embed v2",
    "stratum": "L1",
    "vendor": "Nomic AI",
    "license": "Apache-2.0",
    "url": "https://nomic.ai",
    "description": "Local CPU-friendly embedding model"
  },
  "status": "pending",
  "moderationNotes": "",
  "createdAt": "2026-08-02T02:35:00Z",
  "reviewedAt": null,
  "reviewedByUid": null
}
```

### Collection: `/tool_stats/{toolId}`
```json
{
  "toolId": "litellm-proxy",
  "upvotes": 42,
  "savesCount": 18,
  "lastUpdated": "2026-08-02T02:35:00Z"
}
```

---

## 5. Security Model & Security Rules (Sketched Default-Deny)

### Firestore Security Rules (`firestore.rules`):
```javascript
rules_version =  2;
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default-deny all access
    match /{document=**} {
      allow read, write: if false;
    }
    
    // User profile: User can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User saves subcollection: Strict owner isolation
      match /saves/{saveId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Submissions: Authenticated users can create pending submissions; only admins can approve
    match /submissions/{subId} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.submittedByUid || request.auth.token.admin == true);
      allow create: if request.auth != null && request.resource.data.submittedByUid == request.auth.uid && request.resource.data.status == "pending";
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Public Tool Stats: Publicly readable; updated only via Cloud Functions
    match /tool_stats/{toolId} {
      allow read: if true;
      allow write: if false; // Function-managed
    }
  }
}
```

---

## 6. Accessibility & Non-Manipulative Design Constraints

### Accessibility (WCAG 2.1 AA & Section 508):
- All interactive controls (bookmark buttons, submission forms, modal dialogs) utilize Radix UI / `shadcn` primitives with full ARIA attributes (`aria-expanded`, `aria-label`, `role="dialog"`).
- Mandatory visible focus rings (`focus-visible:ring-2 focus-visible:ring-primary`) across all themes.
- High-contrast Cyber Nouveau theme tokens ensuring a minimum contrast ratio of 4.5:1 for normal text and 3:0:1 for large text/icons.

### Ethical Engagement (No Dark Patterns):
- **No Infinite Scroll / Doomscroll:** Paginated or explicitly triggered "Load More" controls for submission feeds.
- **No Artificial Urgency:** Zero fake popups ("3 people are viewing this tool").
- **No Frictionful Unsubscribe/Delete:** 1-click "Delete Account & Data" action in user settings.

---

## 7. Build-Slicing Plan & Task Dependencies

```
[task-0309: Social Layer Design] (DONE)
          │
          ├──► [task-0310: Accounts & Saves] (Firebase Auth + User Saves Firestore)
          │
          ├──► [task-0311: Contributions & Moderation] (Submit Tool Form + Admin Queue)
          │
          └──► [task-0312: Return Hooks] (Activity Feed + Upvotes + Saved Dashboard)
```

### Task Mapping Matrix:
1. **task-0310 (Accounts + Saves):**
   - Implement Firebase Auth client provider & login/signup UI.
   - Implement "Save to My Stack" button & `/users/{uid}/saves` Firestore sync.
   - *Dependency:* `task-0309` design.

2. **task-0311 (Contributions + Moderation):**
   - Build "Suggest a Tool / Propose Edit" modal form with validation.
   - Deploy Cloud Function for submission sanitization and moderation queue.
   - Build lightweight admin review queue interface.
   - *Dependency:* `task-0310`.

3. **task-0312 (Return Hooks & Activity Feed):**
   - Build public "Community Additions" feed fed by approved submissions.
   - Implement upvote toggle with cloud function counter increment.
   - Add personal saved-stack export (JSON/Markdown format).
   - *Dependency:* `task-0311`.

---

## 8. Verification Contract v1

- **Target Repo:** `7.aOS-Explorer`
- **Deliverable File:** `artifacts/task-0309/explorer-social-layer-design.md`
- **L6 Governance Note:** Ally-only AI policy maintained; zero-PII privacy model enforced; zero direct DoD funding paths recommended.
- **Lesson Line:** Designing strict default-deny Firestore rules alongside static-first SSG prevents client-side data leaks while preserving page load performance.

