// ============================================================
//  js/orders.js
//  Writes completed orders to Firestore "orders" collection.
//  Each document: { userId, userEmail, items, total, status, createdAt }
// ============================================================

import { db } from './firebase-config.js';
import { auth } from './firebase-config.js';
import {
  collection, addDoc, getDocs, query,
  where, orderBy, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getCart, clearCart } from './cart.js';

// ---------- Place an order ----------
export async function placeOrder(shippingInfo = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to place an order.');

  const items = getCart();
  if (items.length === 0) throw new Error('Your cart is empty.');

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order = {
    userId:    user.uid,
    userEmail: user.email,
    items:     items.map(({ id, name, price, qty, imageUrl }) => ({ id, name, price, qty, imageUrl })),
    total,
    shippingInfo,
    status:    'pending',   // pending → processing → shipped → delivered
    createdAt: new Date()
  };

  const ref = await addDoc(collection(db, 'orders'), order);
  clearCart();
  return ref.id;
}

// ---------- Get orders for current user ----------
export async function getUserOrders() {
  const user = auth.currentUser;
  if (!user) return [];
  const snap = await getDocs(
    query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ---------- Get all orders (admin) ----------
export async function getAllOrders() {
  const snap = await getDocs(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ---------- Update order status (admin) ----------
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), { status });
}
