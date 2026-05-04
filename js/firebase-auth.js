// {a}OS Explorer — Firebase Auth Service
// =========================================
// Pure service layer: init, providers, sign-in functions. No DOM wiring.
// DOM wiring lives in firebase-community.js.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as _signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const isConfigured =
  firebaseConfig.apiKey !== "FILL_IN_API_KEY" &&
  firebaseConfig.appId !== "FILL_IN_APP_ID";

export let app = null;
export let auth = null;
export let db = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

const googleProvider = isConfigured ? new GoogleAuthProvider() : null;
const githubProvider = isConfigured ? new GithubAuthProvider() : null;

export async function signInWithGoogle() {
  if (!auth || !googleProvider) return;
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      console.error("[{a}OS Auth] Google sign-in error:", err.code);
    }
  }
}

export async function signInWithGitHub() {
  if (!auth || !githubProvider) return;
  try {
    await signInWithPopup(auth, githubProvider);
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      console.error("[{a}OS Auth] GitHub sign-in error:", err.code);
    }
  }
}

export async function signOut() {
  if (!auth) return;
  try {
    await _signOut(auth);
  } catch (err) {
    console.error("[{a}OS Auth] Sign-out error:", err.message);
  }
}

export { onAuthStateChanged };
