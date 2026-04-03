// ============================================================
//  js/auth.js  — Firebase Authentication (Email/Password)
//  Uses Firebase v10 CDN ES modules
// ============================================================

import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Sign Up: creates Firebase Auth user + Firestore profile ──
export async function signUp(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    role: 'user',       // change to 'admin' manually in Firestore Console
    createdAt: new Date()
  });
  return cred.user;
}

// ── Sign In ──────────────────────────────────────────────────
export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Sign Out ─────────────────────────────────────────────────
export async function logOut() {
  await signOut(auth);
}

// ── Get user role from Firestore ──────────────────────────────
export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data().role : 'user';
  } catch {
    return 'user';
  }
}

// ── Auth guard: redirect to login if not authenticated ────────
export function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (!user) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// ── Admin guard: must be logged in AND have role = 'admin' ────
export async function requireAdmin() {
  const user = await requireAuth('login.html');
  const role = await getUserRole(user.uid);
  if (role !== 'admin') {
    alert('Access denied. Admins only.\n\nSet your role to "admin" in Firestore → users collection → your document.');
    window.location.href = 'index.html';
    throw new Error('Not admin');
  }
  return user;
}

// ── Reactive auth state watcher (for navbar UI updates) ───────
export function watchAuthState(callback) {
  onAuthStateChanged(auth, callback);
}
