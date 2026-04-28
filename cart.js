/* ====================================
   ROYAL PLATTER – Cart JS
   Handles: Add/Remove items, Cart UI,
   Sidebar toggle, Totals
   ==================================== */

"use strict";

// Cart state
let cart = [];

// DOM references
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartFab = document.getElementById("cartFab");
const cartItemsEl = document.getElementById("cartItems");
const cartFooterEl = document.getElementById("cartFooter");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");

// ===== TOGGLE CART =====
function toggleCart() {
  const isOpen = cartSidebar.classList.contains("open");
  if (isOpen) {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("visible");
    document.body.style.overflow = "";
  } else {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }
}

// ===== ADD TO CART =====
function addToCart(name, price) {
  const existing = cart.find((i) => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  renderCart();
  updateCartFab();

  // Visual feedback on button
  const btns = document.querySelectorAll(".add-btn");
  btns.forEach((btn) => {
    if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(name)) {
      btn.textContent = "✓ Added";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "+ Add";
        btn.classList.remove("added");
      }, 1200);
    }
  });

  // Pulse cart fab
  cartFab.classList.remove("pulse");
  void cartFab.offsetWidth; // reflow
  cartFab.classList.add("pulse");
}

// ===== CHANGE QTY =====
function changeQty(name, delta) {
  const item = cart.find((i) => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.name !== name);
  }
  renderCart();
  updateCartFab();
}

// ===== RENDER CART =====
function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your royal platter is empty</p>';
    cartFooterEl.style.display = "none";
    return;
  }

  cartFooterEl.style.display = "block";

  let total = 0;
  let html = "";

  cart.forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-controls">
          <button onclick="changeQty('${item.name}', -1)" aria-label="Decrease">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button onclick="changeQty('${item.name}', 1)" aria-label="Increase">+</button>
        </div>
        <div class="cart-item-price">₹${itemTotal}</div>
      </div>
    `;
  });

  cartItemsEl.innerHTML = html;
  cartTotalEl.textContent = `₹${total}`;
}

// ===== UPDATE FAB =====
function updateCartFab() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalItems;

  if (totalItems > 0) {
    cartFab.classList.add("visible");
  } else {
    cartFab.classList.remove("visible");
  }
}

// ===== WHATSAPP ORDER =====
// Replaces the WhatsApp href with the actual order message
const waBtn = document.querySelector('.cart-footer a[href*="wa.me"]');
if (waBtn) {
  waBtn.addEventListener("click", (e) => {
    if (cart.length === 0) return;

    let message = "Hello! I'd like to place an order from Royal Platter:\n\n";
    let total = 0;

    cart.forEach((item) => {
      message += `• ${item.name} x${item.qty} — ₹${item.price * item.qty}\n`;
      total += item.price * item.qty;
    });

    message += `\n*Total: ₹${total}*\n\nPlease confirm my order. Thank you! 🙏`;

    const phone = "919999999999";
    waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  });
}

// Expose globally
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.changeQty = changeQty;

