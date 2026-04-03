// ============================================================
//  js/firebase-config.js
//  Firebase v10 — ES Module CDN imports
//  NOTE: Storage is NOT used (requires paid plan).
//        Product images are stored as public URLs in Firestore.
// ============================================================

import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyATPH2N2plRY1i-y8M2ZdIZY4WkM84xM7M",
  authDomain:        "modiva-store.firebaseapp.com",
  projectId:         "modiva-store",
  storageBucket:     "modiva-store.firebasestorage.app",
  messagingSenderId: "757627503414",
  appId:             "1:757627503414:web:45422548d314ae0914a997",
  measurementId:     "G-C80LX3QSQZ"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };
