// ============================================================
//  js/products.js — Firestore CRUD (URL-based images)
//  No Firebase Storage needed — works on free Spark plan.
//
//  Image workflow:
//    Admin pastes a public image URL (Imgur, etc.) into the form.
//    The URL is saved directly in the Firestore document as "imageUrl".
// ============================================================

import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const COL = 'products';

// ── Add a new product ──────────────────────────────────────
export async function addProduct(product) {
  const docRef = await addDoc(collection(db, COL), {
    name: product.name || '',
    price: Number(product.price) || 0,
    category: product.category || '',
    brand: product.brand || '',
    rating: Number(product.rating) || 5,
    isNew: product.isNew ?? false,
    imageUrl: product.imageUrl || '',   // public URL saved directly
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...product };
}

// ── Update an existing product ─────────────────────────────
export async function updateProduct(id, updates) {
  await updateDoc(doc(db, COL, id), {
    ...updates,
    price: Number(updates.price) || 0,
    rating: Number(updates.rating) || 5,
    updatedAt: serverTimestamp()
  });
}

// ── Delete a product ───────────────────────────────────────
export async function deleteProduct(id) {
  await deleteDoc(doc(db, COL, id));
}

// ── Local Image Mapping (No People Style) ─────────────────
const PRODUCT_IMAGE_MAP = {
  "Classic Beige Trench": "images/products/trench.png",
  "Rebel Leather Jacket": "images/products/leather-jacket.png",
  "Scarlet Evening Gown": "images/products/red-gown.png",
  "Floral Meadow Dress": "images/products/floral-dress.png",
  "Urban Knit Turtleneck": "images/products/knit-sweater.png",
  "Midnight Lace Cami": "images/products/lace-cami.png",
  "Emerald Silk Blouse": "images/products/silk-blouse.png",
  "Soft Cable Knit": "images/products/cable-knit.png"
};

function mapProductImages(products) {
  return products.map(p => ({
    ...p,
    imageUrl: PRODUCT_IMAGE_MAP[p.name] || p.imageUrl
  }));
}

// ── Get products filtered by category ─────────────────────
export async function getProductsByCategory(category) {
  const snap = await (await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"))
    .getDocs(query(collection(db, COL), where('category', '==', category), orderBy('createdAt', 'desc')));
  const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return mapProductImages(products);
}

// ── Real-time listener ─────────────────────────────────────
export function listenToProducts(callback) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(mapProductImages(products));
  }, (err) => {
    console.error('[Modiva] Firestore error:', err.message);
  });
}
