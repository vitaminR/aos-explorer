// {a}OS Explorer — Firebase Auth Module
// =======================================
// GitHub OAuth sign-in, auth state tracking, and header UI wiring.
// Loaded as <script type="module"> — no build step required.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut as _signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

// ─── Guard: skip silently if config is not yet filled in ─────────────────────
const isConfigured =
  firebaseConfig.apiKey !== "FILL_IN_API_KEY" &&
  firebaseConfig.appId !== "FILL_IN_APP_ID";

if (!isConfigured) {
  console.warn(
    "[{a}OS Auth] Firebase config placeholders detected. " +
      "Complete Day 1 console setup then fill in js/firebase-config.js to enable sign-in.",
  );
  // Hide sign-in button so UX stays clean during pre-launch
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("auth-signin-btn");
    if (btn) btn.style.display = "none";
  });
}

// ─── Firebase init ───────────────────────────────────────────────────────────
let auth, db;

if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

// ─── GitHub provider ─────────────────────────────────────────────────────────
const githubProvider = isConfigured ? new GithubAuthProvider() : null;

// ─── Auth actions ─────────────────────────────────────────────────────────────

export async function signInWithGitHub() {
  if (!isConfigured) return;
  try {
    await signInWithPopup(auth, githubProvider);
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      console.error("[{a}OS Auth] Sign-in error:", err.code, err.message);
    }
  }
}

export async function signOut() {
  if (!isConfigured || !auth) return;
  try {
    await _signOut(auth);
  } catch (err) {
    console.error("[{a}OS Auth] Sign-out error:", err.message);
  }
}

// ─── User profile bootstrap ──────────────────────────────────────────────────
// Creates a profile doc on first sign-in; updates lastActive on every sign-in.

async function bootstrapUserProfile(user) {
  if (!db) return;
  const ref = doc(db, "user_profiles", user.uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        username: user.displayName || user.email?.split("@")[0] || "Anonymous",
        avatarUrl: user.photoURL || "",
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActive: serverTimestamp(),
        badges: [],
        role: "user",
        createdAt: serverTimestamp(),
      });
    } else {
      // Touch lastActive on every login
      await setDoc(ref, { lastActive: serverTimestamp() }, { merge: true });
    }
  } catch (err) {
    // Non-fatal — profile bootstrap failure should not break the auth flow
    console.warn(
      "[{a}OS Auth] Profile bootstrap error (Firestore not yet enabled?):",
      err.message,
    );
  }
}

// ─── Header UI ────────────────────────────────────────────────────────────────

function updateAuthUI(user) {
  const btnSignIn = document.getElementById("auth-signin-btn");
  const userPanel = document.getElementById("auth-user-panel");
  const userAvatar = document.getElementById("auth-avatar");
  const userNameEl = document.getElementById("auth-username");

  if (!btnSignIn || !userPanel) return; // DOM not ready or elements removed

  if (user) {
    btnSignIn.style.display = "none";
    userPanel.style.display = "flex";
    userAvatar.src = user.photoURL || "";
    userAvatar.alt = user.displayName || "User";
    userNameEl.textContent =
      user.displayName || user.email?.split("@")[0] || "User";
  } else {
    btnSignIn.style.display = "flex";
    userPanel.style.display = "none";
  }
}

// ─── Wire up buttons ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  if (!isConfigured) return;

  const btnSignIn = document.getElementById("auth-signin-btn");
  const btnSignOut = document.getElementById("auth-signout-btn");

  if (btnSignIn) btnSignIn.addEventListener("click", signInWithGitHub);
  if (btnSignOut) btnSignOut.addEventListener("click", signOut);

  // React to Firebase auth state changes
  onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
    if (user) bootstrapUserProfile(user);
  });
});
