// ============================================================
//  js/cart.js
//  Cart is stored in localStorage (session-persistent).
//  When user checks out, an order is written to Firestore.
// ============================================================

const CART_KEY = 'modiva_cart';

// ---------- Read cart ----------
export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

// ---------- Save cart ----------
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ---------- Add item to cart ----------
export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" added to cart!`);
}

// ---------- Remove item ----------
export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

// ---------- Change qty ----------
export function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
  }
  saveCart(cart);
}

// ---------- Clear cart ----------
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

// ---------- Cart total ----------
export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ---------- Cart item count ----------
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ---------- Update cart badge in navbar ----------
export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// ---------- Toast notification ----------
function showToast(message) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 9999;
      background: #1a6b3a; color: #fff; padding: 14px 22px;
      border-radius: 10px; font-size: 14px; font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      opacity: 0; transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}
