/* ====================================
   ROYAL PLATTER – Menu JS
   Handles: Category filtering with
   smooth animated transitions
   ==================================== */

"use strict";

const tabBtns = document.querySelectorAll(".tab-btn");
const menuCards = document.querySelectorAll(".menu-card");

// ===== FILTER MENU =====
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.cat;

    // Update active tab
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Filter cards
    menuCards.forEach((card, index) => {
      const cardCat = card.dataset.cat;
      const shouldShow = cat === "all" || cardCat === cat;

      if (shouldShow) {
        card.classList.remove("hidden");
        // Stagger animation
        card.style.animationDelay = `${index * 0.05}s`;
        // Re-trigger reveal if not visible
        card.classList.remove("visible");
        setTimeout(() => {
          card.classList.add("visible");
        }, 50 + index * 40);
      } else {
        card.classList.add("hidden");
      }
    });

    // Re-observe for scroll reveal
    if (window.reObserveReveal) {
      setTimeout(window.reObserveReveal, 200);
    }
  });
});

// ===== INIT: Show all as visible on load =====
// (Intersection observer in main.js handles the rest)
document.addEventListener("DOMContentLoaded", () => {
  // All cards start visible since the observer handles them
  // Stagger delays for initial grid load
  menuCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.04}s`;
  });
});

