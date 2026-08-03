// {a}OS Explorer — Community Layer
// ==================================
// Auth UI, voting, and waitlist. All onclick-reachable functions exposed on window.

import {
  auth, db, isConfigured,
  signInWithGoogle, signInWithGitHub, signOut,
  onAuthStateChanged,
} from "./firebase-auth.js";
import {
  doc, getDoc, setDoc, deleteDoc,
  collection, query, where, getDocs, addDoc,
  serverTimestamp, increment, getCountFromServer, Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── State ────────────────────────────────────────────────────────────────────
let currentUser = null;
let localVotes = JSON.parse(localStorage.getItem("aos7_votes") || "{}");

// ─── Referral tracking ────────────────────────────────────────────────────────
// Capture ?ref= on landing and persist for the sign-up flow
const _urlRef = new URLSearchParams(window.location.search).get("ref");
if (_urlRef && _urlRef !== "") localStorage.setItem("aos7_ref", _urlRef);
const storedRef = localStorage.getItem("aos7_ref") || null;

// ─── Window-exposed functions (required for onclick="" attrs) ─────────────────
window.authSignInGoogle = async () => {
  await signInWithGoogle();
  closeAuthMenu();
  closeCommunityModal();
};

window.authSignInGitHub = async () => {
  await signInWithGitHub();
  closeAuthMenu();
  closeCommunityModal();
};

window.openCommunityModal = openCommunityModal;
window.closeCommunityModal = closeCommunityModal;
window.openAuthMenu = openAuthMenu;
window.submitWaitlist = submitWaitlist;
window.copyReferralLink = copyReferralLink;

// ─── Auth menu (header dropdown) ─────────────────────────────────────────────
function openAuthMenu(event) {
  event?.stopPropagation();
  document.getElementById("authProviderMenu")?.classList.toggle("open");
}

function closeAuthMenu() {
  document.getElementById("authProviderMenu")?.classList.remove("open");
}

// ─── Community modal ──────────────────────────────────────────────────────────
function openCommunityModal() {
  const overlay = document.getElementById("communityOverlay");
  if (!overlay) return;
  overlay.classList.add("open");
  closeAuthMenu();

  const formView = document.getElementById("communityFormView");
  const successView = document.getElementById("communitySuccessView");
  const referralView = document.getElementById("communityReferralView");

  if (currentUser) {
    // Signed-in users see their referral dashboard
    if (formView) formView.style.display = "none";
    if (successView) successView.style.display = "none";
    if (referralView) referralView.style.display = "";
    loadReferralLink(currentUser.uid);
  } else {
    if (formView) formView.style.display = "";
    if (successView) successView.style.display = "none";
    if (referralView) referralView.style.display = "none";
    const btn = document.getElementById("waitlistSubmitBtn");
    if (btn) { btn.disabled = false; btn.textContent = "Join the Community"; }
    loadMemberCount();
  }
}

function closeCommunityModal() {
  document.getElementById("communityOverlay")?.classList.remove("open");
}

async function loadMemberCount() {
  const el = document.getElementById("communityMemberCount");
  if (!el) return;
  if (!db) { el.textContent = "Be among the first"; return; }
  try {
    const snap = await getCountFromServer(collection(db, "waitlist"));
    const n = snap.data().count;
    el.textContent = n > 0 ? `${n.toLocaleString()}` : "Be among the first";
  } catch {
    el.textContent = "Be among the first";
  }
}

// ─── Waitlist form ────────────────────────────────────────────────────────────
async function submitWaitlist(event) {
  event.preventDefault();
  const btn = document.getElementById("waitlistSubmitBtn");
  const email = document.getElementById("waitlistEmail")?.value?.trim();
  const name = document.getElementById("waitlistName")?.value?.trim() || "";
  if (!email) return;

  btn.disabled = true;
  btn.textContent = "Joining…";

  if (db) {
    try {
      await addDoc(collection(db, "waitlist"), {
        email, name, source: "explorer",
        ref: storedRef,
        joinedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("[{a}OS Community] Waitlist write error:", err.message);
    }
  }

  // Show success state regardless of Firestore outcome
  const formView = document.getElementById("communityFormView");
  const successView = document.getElementById("communitySuccessView");
  if (formView) formView.style.display = "none";
  if (successView) successView.style.display = "";
}

// ─── Referral link helpers ────────────────────────────────────────────────────
function getReferralUrl(uid) {
  return `${window.location.origin}${window.location.pathname}?ref=${uid}`;
}

function loadReferralLink(uid) {
  const url = getReferralUrl(uid);
  const mainInput = document.getElementById("referralLinkInput");
  if (mainInput) mainInput.value = url;

  // Wire share buttons
  const twitterBtn = document.getElementById("referralTwitterBtn");
  if (twitterBtn) {
    const tweet = encodeURIComponent(
      `I'm using {a}OS Explorer — the OSI model for AI. Maps every major agentic tool across 7 strata. Check it out: ${url}`
    );
    twitterBtn.onclick = () => window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  }
  const liBtn = document.getElementById("referralLinkedinBtn");
  if (liBtn) {
    liBtn.onclick = () => window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank"
    );
  }
}

function copyReferralLink(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 2000);
  }).catch(() => {
    input.select();
    document.execCommand("copy");
  });
}

// ─── Auth state → header UI ───────────────────────────────────────────────────
function updateAuthUI(user) {
  currentUser = user;
  const btnSignIn = document.getElementById("auth-signin-btn");
  const joinBtn = document.getElementById("communityJoinNavBtn");
  const userPanel = document.getElementById("auth-user-panel");
  const avatar = document.getElementById("auth-avatar");
  const username = document.getElementById("auth-username");
  const xpBadge = document.getElementById("auth-xp-badge");

  if (user) {
    if (btnSignIn) btnSignIn.style.display = "none";
    if (joinBtn) joinBtn.style.display = "none";
    if (userPanel) userPanel.style.display = "flex";
    if (avatar) { avatar.src = user.photoURL || ""; avatar.alt = user.displayName || "User"; }
    if (username) username.textContent = user.displayName?.split(" ")[0] || user.email?.split("@")[0] || "User";
    loadUserXP(user.uid, xpBadge);
    syncVotesFromFirestore(user.uid);
    // Wire referral link in success view (if it's visible from email signup flow)
    const successRow = document.getElementById("successReferralRow");
    const successInput = document.getElementById("successReferralInput");
    if (successRow && successInput) {
      successInput.value = getReferralUrl(user.uid);
      successRow.style.display = "flex";
    }
  } else {
    if (btnSignIn) btnSignIn.style.display = "";
    if (joinBtn) joinBtn.style.display = "";
    if (userPanel) userPanel.style.display = "none";
    if (xpBadge) xpBadge.textContent = "0 XP";
  }
}

async function bootstrapUserProfile(user) {
  if (!db) return;
  const profileRef = doc(db, "user_profiles", user.uid);
  try {
    const snap = await getDoc(profileRef);
    if (!snap.exists()) {
      await setDoc(profileRef, {
        username: user.displayName || user.email?.split("@")[0] || "Anonymous",
        avatarUrl: user.photoURL || "",
        xp: 0, level: 1, streakDays: 0,
        badges: ["early_adopter"],
        role: "contributor",
        referredBy: storedRef || null,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      // Clear ref — one-time attribution only
      if (storedRef) localStorage.removeItem("aos7_ref");
    } else {
      await setDoc(profileRef, { lastActive: serverTimestamp() }, { merge: true });
    }
  } catch (err) {
    console.warn("[{a}OS Community] Profile bootstrap error:", err.message);
  }
}

async function loadUserXP(uid, el) {
  if (!el || !db) return;
  try {
    const snap = await getDoc(doc(db, "user_profiles", uid));
    if (snap.exists()) el.textContent = `${snap.data().xp ?? 0} XP`;
  } catch { /* non-fatal */ }
}

// ─── Vote buttons ─────────────────────────────────────────────────────────────
function injectVoteButtons() {
  document.querySelectorAll(".product-card").forEach((card) => {
    if (card.querySelector(".vote-btn")) return;
    const onclickAttr = card.getAttribute("onclick") || "";
    const match = onclickAttr.match(/selectProduct\(['"]([^'"]+)['"]\)/);
    if (!match) return;
    const productId = match[1];

    const btn = document.createElement("button");
    btn.className = "vote-btn" + (localVotes[productId] ? " voted" : "");
    btn.dataset.productId = productId;
    btn.title = localVotes[productId] ? "Remove your vote" : "Upvote this tool";
    btn.innerHTML = `<span class="vote-arrow">▲</span><span class="vote-count">0</span>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVote(productId, btn);
    });
    card.appendChild(btn);
  });
}

async function loadAllVoteCounts() {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, "votes"));
    snap.forEach((d) => {
      const btn = document.querySelector(`.vote-btn[data-product-id="${d.id}"]`);
      if (btn) {
        const el = btn.querySelector(".vote-count");
        if (el) el.textContent = d.data().count ?? 0;
      }
    });
  } catch (err) {
    console.warn("[{a}OS Community] Vote count load error:", err.message);
  }
}

async function toggleVote(productId, btn) {
  const wasVoted = !!localVotes[productId];
  const countEl = btn.querySelector(".vote-count");
  const currentCount = parseInt(countEl?.textContent || "0", 10);

  // Optimistic update
  if (wasVoted) {
    delete localVotes[productId];
    btn.classList.remove("voted");
    btn.title = "Upvote this tool";
    if (countEl) countEl.textContent = Math.max(0, currentCount - 1);
  } else {
    localVotes[productId] = Date.now();
    btn.classList.add("voted");
    btn.title = "Remove your vote";
    if (countEl) countEl.textContent = currentCount + 1;
  }
  localStorage.setItem("aos7_votes", JSON.stringify(localVotes));
  syncPanelVoteBtn(productId);

  if (currentUser && db) {
    const voteDocId = `${currentUser.uid}_${productId}`;
    const voteRef = doc(db, "user_votes", voteDocId);
    const countRef = doc(db, "votes", productId);
    try {
      if (wasVoted) {
        await deleteDoc(voteRef);
        await setDoc(countRef, { count: increment(-1) }, { merge: true });
      } else {
        await setDoc(voteRef, { uid: currentUser.uid, productId, votedAt: serverTimestamp() });
        await setDoc(countRef, { count: increment(1) }, { merge: true });
      }
    } catch (err) {
      console.warn("[{a}OS Community] Vote sync error:", err.message);
    }
  } else if (!currentUser) {
    showVoteNudge();
  }
}

function showVoteNudge() {
  document.getElementById("voteNudge")?.remove();
  const nudge = document.createElement("div");
  nudge.id = "voteNudge";
  nudge.className = "vote-nudge";
  nudge.innerHTML = `Sign in to make your votes count &nbsp;<button onclick="openCommunityModal()">Join free</button>`;
  document.body.appendChild(nudge);
  setTimeout(() => nudge.remove(), 4000);
}

async function syncVotesFromFirestore(uid) {
  if (!db) return;
  try {
    const q = query(collection(db, "user_votes"), where("uid", "==", uid));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const { productId } = d.data();
      if (productId && !localVotes[productId]) {
        localVotes[productId] = Date.now();
      }
    });
    localStorage.setItem("aos7_votes", JSON.stringify(localVotes));
    // Refresh button states
    document.querySelectorAll(".vote-btn").forEach((btn) => {
      const pid = btn.dataset.productId;
      btn.classList.toggle("voted", !!localVotes[pid]);
      btn.title = localVotes[pid] ? "Remove your vote" : "Upvote this tool";
    });
  } catch (err) {
    console.warn("[{a}OS Community] Vote sync error:", err.message);
  }
}

// ─── Detail panel vote integration ───────────────────────────────────────────
// Called by selectProduct() in explorer.html after the panel renders.
window._communityProductSelected = async (productId) => {
  const panelBtn = document.getElementById("panelVoteBtn");
  const panelCount = document.getElementById("panelVoteCount");
  if (!panelBtn) return;

  // Mark product on button for cross-sync
  panelBtn.dataset.productId = productId;

  // Immediate local state from localStorage
  panelBtn.classList.toggle("voted", !!localVotes[productId]);
  panelBtn.textContent = localVotes[productId] ? "▲ Voted" : "▲ Vote";

  // Wire panel vote button to reuse card toggle logic
  window.togglePanelVote = () => {
    const cardBtn = document.querySelector(`.vote-btn[data-product-id="${productId}"]`);
    if (cardBtn) {
      cardBtn.click();
    } else {
      // Card not visible (filtered out) — call toggleVote directly
      toggleVote(productId, panelBtn);
    }
    // Sync panel button state after a tick
    setTimeout(() => {
      panelBtn.classList.toggle("voted", !!localVotes[productId]);
      panelBtn.textContent = localVotes[productId] ? "▲ Voted" : "▲ Vote";
    }, 60);
  };

  // Load real count from Firestore
  if (!db) {
    if (panelCount) panelCount.textContent = "—";
    return;
  }
  try {
    const snap = await getDoc(doc(db, "votes", productId));
    if (panelCount) {
      panelCount.textContent = snap.exists() ? (snap.data().count ?? 0) : 0;
    }
  } catch {
    if (panelCount) panelCount.textContent = "—";
  }
};

// Keep panel button in sync when card vote button is toggled
function syncPanelVoteBtn(productId) {
  const panelBtn = document.getElementById("panelVoteBtn");
  if (panelBtn && panelBtn.dataset.productId === productId) {
    panelBtn.classList.toggle("voted", !!localVotes[productId]);
    panelBtn.textContent = localVotes[productId] ? "▲ Voted" : "▲ Vote";
  }
}

// ─── Trending products ────────────────────────────────────────────────────────
async function loadTrendingProducts() {
  if (!db) return;
  try {
    const sevenDaysAgo = Timestamp.fromMillis(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const q = query(collection(db, "user_votes"), where("votedAt", ">=", sevenDaysAgo));
    const snap = await getDocs(q);
    const counts = {};
    snap.forEach(d => {
      const pid = d.data().productId;
      if (pid) counts[pid] = (counts[pid] || 0) + 1;
    });
    const top5 = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);
    if (window.renderTrendingBanner) window.renderTrendingBanner(top5);
  } catch (err) {
    console.warn("[{a}OS Community] Trending load error:", err.message);
  }
}

// ─── Stratum Watchlist (Firestore sync) ──────────────────────────────────────
async function syncWatchlistFromFirestore(uid) {
  if (!db) return;
  try {
    const snap = await getDocs(query(collection(db, "watchlists"), where("uid", "==", uid)));
    const watched = {};
    snap.forEach(d => { if (d.data().stratum) watched[d.data().stratum] = true; });
    localStorage.setItem("aos7_watched", JSON.stringify(watched));
    if (window._syncWatchButtons) window._syncWatchButtons(watched);
  } catch (err) {
    console.warn("[{a}OS Community] Watchlist sync error:", err.message);
  }
}

window._firestoreToggleWatch = async (stratumId, isWatching) => {
  if (!db || !currentUser) return;
  const docId = `${currentUser.uid}_${stratumId}`;
  const ref = doc(db, "watchlists", docId);
  try {
    if (isWatching) {
      await setDoc(ref, { uid: currentUser.uid, stratum: stratumId, createdAt: serverTimestamp() });
    } else {
      await deleteDoc(ref);
    }
  } catch (err) {
    console.warn("[{a}OS Community] Watchlist toggle error:", err.message);
  }
};


// ─── Return Hooks: Recent Activity Feed (task-0312) ──────────────────────────
window.loadRecentActivityFeed = async (limitCount = 10) => {
  if (!db) return [];
  try {
    const snap = await getDocs(query(collection(db, "activity")));
    const items = [];
    snap.forEach(d => {
      const data = d.data();
      items.push({ id: d.id, ...data });
    });
    items.sort((a, b) => {
      const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.timestamp || 0);
      const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.timestamp || 0);
      return tB - tA;
    });
    return items.slice(0, limitCount);
  } catch (err) {
    console.warn("[{a}OS Community] Activity feed load error:", err.message);
    return [];
  }
};

// SECURITY (task-0312 F-0312-C Setzer): never interpolate untrusted activity fields into
// innerHTML. Admin-written activity is still attacker-shaped if an admin account is
// compromised or a future rule slip lets non-admin write. Use textContent + DOM nodes.
window.renderRecentActivity = async (containerId = "communityActivityFeed") => {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = await window.loadRecentActivityFeed(10);
  container.replaceChildren();
  if (!items || items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "activity-empty-state";
    const p = document.createElement("p");
    p.textContent = "No recent community activity yet. Approved contributions and catalog updates will appear here.";
    empty.appendChild(p);
    container.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "activity-item";
    row.dataset.id = String(item.id ?? "");

    const typeEl = document.createElement("span");
    typeEl.className = "activity-type-badge";
    typeEl.textContent = item.type || "Update";

    const titleEl = document.createElement("span");
    titleEl.className = "activity-title";
    titleEl.textContent = item.title || item.name || "Catalog Item";

    const descEl = document.createElement("span");
    descEl.className = "activity-desc";
    descEl.textContent = item.description || "";

    row.append(typeEl, titleEl, descEl);
    frag.appendChild(row);
  }
  container.appendChild(frag);
};

// ─── DOM ready ────────────────────────────────────────────────────────────────
// type="module" scripts are deferred — DOM may already be ready when this runs
function init() {
  injectVoteButtons();
  loadAllVoteCounts();
  loadTrendingProducts();

  // Close auth menu when clicking outside the auth zone
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#authZone")) closeAuthMenu();
  });

  // Close community modal on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCommunityModal();
      closeAuthMenu();
    }
  });

  // Sign-out button
  document.getElementById("auth-signout-btn")?.addEventListener("click", async () => {
    await signOut();
    localVotes = {};
    localStorage.removeItem("aos7_votes");
    document.querySelectorAll(".vote-btn").forEach((btn) => {
      btn.classList.remove("voted");
      btn.title = "Upvote this tool";
    });
  });

  if (!isConfigured) {
    document.getElementById("auth-signin-btn")?.style &&
      (document.getElementById("auth-signin-btn").style.display = "none");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
    if (user) bootstrapUserProfile(user);
    if (user) syncWatchlistFromFirestore(user.uid);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
