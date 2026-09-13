/**
 * RAJA'S WEAR — Luxury Men's Formalwear & Suits
 * Core JavaScript Engine: Theming, Cart, Wishlist, Modals, Search, Validation
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initCart();
  initWishlist();
  initSearch();
  initQuickView();
  initSizeGuide();
  initAccordions();
  initToast();

  // Page-specific initializers
  const path = window.location.pathname.toLowerCase();
  if (path.includes("products.html")) {
    initShopPage();
  } else if (path.includes("product.html")) {
    initProductDetailPage();
  } else if (path.includes("cart.html")) {
    initCartPage();
  } else if (path.includes("contact.html")) {
    initContactPage();
  } else if (path.includes("about.html")) {
    initAboutPage();
  } else {
    // Default home page
    initHomePage();
  }
});

/* ==========================================================================
   1. THEME ENGINE (DARK / LIGHT MODE & LOCALSTORAGE)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("raja_theme") || "dark";
  applyTheme(savedTheme);

  const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("raja_theme", theme);
  const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
  toggleBtns.forEach((btn) => {
    btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "Light" : "Dark"} mode`);
  });
}

/* ==========================================================================
   2. NAVBAR & MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initNavbar() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-menu-drawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking a nav link inside drawer
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  function openMobileMenu() {
    drawer.classList.add("open");
    toggleBtn.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("modal-open");
  }

  function closeMobileMenu() {
    drawer.classList.remove("open");
    toggleBtn.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  }
}

/* ==========================================================================
   3. SHOPPING CART ENGINE (LOCALSTORAGE, DRAWER, CALCULATIONS)
   ========================================================================== */
const CART_STORAGE_KEY = "raja_cart";
const PROMO_STORAGE_KEY = "raja_promo";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadges();
  renderCartDrawer();
}

function addToCart(productId, size = null, color = null, quantity = 1) {
  const product = RAJA_PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const chosenSize = size || product.sizes[0];
  const chosenColor = color || (product.colors[0] ? product.colors[0].name : "Standard");

  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (item) => item.id === productId && item.size === chosenSize && item.color === chosenColor
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      cartItemId: `${productId}-${chosenSize}-${chosenColor}-${Date.now()}`,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: chosenSize,
      color: chosenColor,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to your shopping bag.`);
  openCartDrawer();
}

function removeFromCart(cartItemId) {
  let cart = getCart();
  cart = cart.filter((item) => item.cartItemId !== cartItemId);
  saveCart(cart);
  showToast("Item removed from shopping bag.");
  if (window.location.pathname.toLowerCase().includes("cart.html")) {
    renderCartPageItems();
  }
}

function updateCartQuantity(cartItemId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.cartItemId === cartItemId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    saveCart(cart);
    if (window.location.pathname.toLowerCase().includes("cart.html")) {
      renderCartPageItems();
    }
  }
}

function getCartCalculations() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free shipping over $200
  const freeShippingThreshold = 200;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
  const shippingLeft = Math.max(0, freeShippingThreshold - subtotal);

  // Active Promo Code
  const activePromo = localStorage.getItem(PROMO_STORAGE_KEY);
  let discount = 0;
  if (activePromo === "RAJA10") {
    discount = Math.round(subtotal * 0.1);
  }

  const tax = Math.round((subtotal - discount) * 0.08);
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  return {
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shippingFee,
    shippingLeft,
    freeShippingThreshold,
    discount,
    activePromo,
    tax,
    total
  };
}

function updateCartBadges() {
  const { itemCount } = getCartCalculations();
  const badges = document.querySelectorAll(".cart-badge-count");
  badges.forEach((b) => {
    b.textContent = itemCount;
    b.style.display = itemCount > 0 ? "flex" : "none";
  });
}

function renderCartDrawer() {
  const drawerItems = document.querySelector(".cart-drawer-items");
  const drawerSubtotal = document.querySelector(".cart-drawer-subtotal");
  const shippingProgressBar = document.querySelector(".shipping-progress-fill");
  const shippingProgressText = document.querySelector(".shipping-progress-text");

  if (!drawerItems) return;

  const cart = getCart();
  const { subtotal, shippingLeft, freeShippingThreshold } = getCartCalculations();

  if (drawerSubtotal) {
    drawerSubtotal.textContent = `$${subtotal.toLocaleString()}`;
  }

  // Shipping Progress Bar
  if (shippingProgressBar && shippingProgressText) {
    if (subtotal === 0) {
      shippingProgressBar.style.width = "0%";
      shippingProgressText.innerHTML = `Add <strong>$${freeShippingThreshold}</strong> for complimentary global shipping`;
    } else if (shippingLeft > 0) {
      const pct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      shippingProgressBar.style.width = `${pct}%`;
      shippingProgressText.innerHTML = `Add <strong>$${shippingLeft}</strong> more for complimentary shipping!`;
    } else {
      shippingProgressBar.style.width = "100%";
      shippingProgressText.innerHTML = `✨ You have earned <strong>Complimentary Worldwide Shipping</strong>!`;
    }
  }

  if (cart.length === 0) {
    drawerItems.innerHTML = `
      <div class="empty-cart-view">
        <div class="empty-cart-icon">🛍️</div>
        <h3>Your Shopping Bag is Empty</h3>
        <p style="margin: 0.5rem 0 1.5rem; font-size: 0.9rem;">Explore our masterfully tailored suits and formalwear.</p>
        <a href="products.html" class="btn btn-primary btn-sm">Shop Collections</a>
      </div>
    `;
    return;
  }

  drawerItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-cart-id="${item.cartItemId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-variants">Size: ${item.size} • Color: ${item.color}</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
          <div class="cart-item-actions">
            <div class="cart-item-qty">
              <button type="button" onclick="updateCartQuantity('${item.cartItemId}', -1)" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="updateCartQuantity('${item.cartItemId}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="cart-item-remove" onclick="removeFromCart('${item.cartItemId}')">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function openCartDrawer() {
  const overlay = document.querySelector(".cart-drawer-overlay");
  const drawer = document.querySelector(".cart-drawer");
  if (overlay && drawer) {
    overlay.classList.add("active");
    drawer.classList.add("open");
    document.body.classList.add("modal-open");
  }
}

function closeCartDrawer() {
  const overlay = document.querySelector(".cart-drawer-overlay");
  const drawer = document.querySelector(".cart-drawer");
  if (overlay && drawer) {
    overlay.classList.remove("active");
    drawer.classList.remove("open");
    document.body.classList.remove("modal-open");
  }
}

function initCart() {
  updateCartBadges();
  renderCartDrawer();

  // Cart trigger buttons
  document.querySelectorAll(".cart-drawer-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  const closeBtn = document.querySelector(".cart-drawer-close");
  const overlay = document.querySelector(".cart-drawer-overlay");
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (overlay) overlay.addEventListener("click", closeCartDrawer);
}

/* ==========================================================================
   4. WISHLIST SYSTEM (LOCALSTORAGE, BADGES, TOGGLE)
   ========================================================================== */
const WISHLIST_KEY = "raja_wishlist";

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const product = RAJA_PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`Removed "${product.name}" from wishlist.`);
  } else {
    wishlist.push(productId);
    showToast(`Saved "${product.name}" to wishlist.`);
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  updateWishlistBadges();
  updateWishlistIcons();
}

function updateWishlistBadges() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  document.querySelectorAll(".wishlist-badge-count").forEach((b) => {
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });
}

function updateWishlistIcons() {
  const wishlist = getWishlist();
  document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
    const id = btn.getAttribute("data-wishlist-id");
    if (wishlist.includes(id)) {
      btn.classList.add("wishlisted");
      btn.setAttribute("aria-label", "Remove from wishlist");
    } else {
      btn.classList.remove("wishlisted");
      btn.setAttribute("aria-label", "Add to wishlist");
    }
  });
}

function initWishlist() {
  updateWishlistBadges();
  updateWishlistIcons();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wishlist-id]");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-wishlist-id");
      toggleWishlist(id);
    }
  });
}

/* ==========================================================================
   5. SEARCH ENGINE MODAL
   ========================================================================== */
function initSearch() {
  const searchModal = document.getElementById("searchModal");
  const searchInputs = document.querySelectorAll(".search-modal-input");
  const searchResults = document.querySelector(".search-modal-results");
  const searchTriggers = document.querySelectorAll(".search-trigger");

  if (!searchModal) return;

  searchTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(searchModal);
      const input = searchModal.querySelector("input");
      if (input) setTimeout(() => input.focus(), 150);
    });
  });

  searchInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      renderSearchResults(query, searchResults);
    });
  });
}

function renderSearchResults(query, container) {
  if (!container) return;

  if (!query) {
    container.innerHTML = `
      <p style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">
        Type to discover bespoke suits, dinner jackets, silk ties, and formal accessories.
      </p>
    `;
    return;
  }

  const results = RAJA_PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.subCategory.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query)
    );
  });

  if (results.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 0;">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No matching garments found for "<strong>${query}</strong>"</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Try searching for "Tuxedo", "Navy", "Linen", or "Velvet".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results
    .map(
      (p) => `
      <a href="product.html?id=${p.id}" class="search-result-item">
        <img src="${p.images[0]}" alt="${p.name}" class="search-result-img" />
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">${p.name}</h4>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-gold);">${p.category} • ${p.subCategory}</span>
        </div>
        <span style="font-weight: 700; color: var(--text-primary);">$${p.price.toLocaleString()}</span>
      </a>
    `
    )
    .join("");
}

/* ==========================================================================
   6. QUICK VIEW MODAL
   ========================================================================== */
function initQuickView() {
  const modal = document.getElementById("quickViewModal");
  if (!modal) return;

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-quickview-id]");
    if (trigger) {
      e.preventDefault();
      const id = trigger.getAttribute("data-quickview-id");
      openQuickView(id);
    }
  });
}

function openQuickView(productId) {
  const product = RAJA_PRODUCTS.find((p) => p.id === productId);
  const modal = document.getElementById("quickViewModal");
  const content = document.getElementById("quickViewContent");

  if (!product || !modal || !content) return;

  content.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-media">
        <img src="${product.images[0]}" alt="${product.name}" id="qvMainImg" />
      </div>
      <div class="quick-view-info">
        <span class="eyebrow">${product.category} • ${product.subCategory}</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 0.75rem;">${product.name}</h2>
        
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          <div class="product-rating">
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span>${product.rating}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">(${product.reviewCount} client reviews)</span>
        </div>

        <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.25rem;">
          $${product.price.toLocaleString()}
          ${product.oldPrice ? `<span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through; margin-left: 0.5rem;">$${product.oldPrice.toLocaleString()}</span>` : ""}
        </div>

        <p style="font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">${product.shortDesc}</p>

        <!-- Color Selection -->
        <div style="margin-bottom: 1.25rem;">
          <div class="option-label"><span>Color</span> <span id="qvSelectedColor">${product.colors[0]?.name || "Standard"}</span></div>
          <div class="color-picker-group">
            ${product.colors
              .map(
                (c, i) => `
              <button type="button" class="color-option-btn ${i === 0 ? "active" : ""}" onclick="selectQvColor(this, '${c.name}')">
                <span class="color-dot" style="background-color: ${c.hex};"></span>
                <span>${c.name}</span>
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Size Selection -->
        <div style="margin-bottom: 1.5rem;">
          <div class="option-label"><span>Select Size</span> <span class="size-guide-trigger" onclick="openSizeGuide()">Size Chart</span></div>
          <div class="size-picker-group">
            ${product.sizes
              .map(
                (s, i) => `
              <button type="button" class="size-btn ${i === 0 ? "active" : ""}" onclick="selectQvSize(this, '${s}')">${s}</button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
          <button type="button" class="btn btn-primary btn-full" id="qvAddBtn" onclick="handleQvAdd('${product.id}')">
            Add to Bag
          </button>
          <button type="button" class="btn-icon" data-wishlist-id="${product.id}" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <a href="product.html?id=${product.id}" class="link-arrow" style="font-size: 0.85rem;">
          View Full Atelier Specifications & Craftsmanship Details &rarr;
        </a>
      </div>
    </div>
  `;

  openModal(modal);
  updateWishlistIcons();
}

window.selectQvColor = function (btn, colorName) {
  btn.parentElement.querySelectorAll(".color-option-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("qvSelectedColor").textContent = colorName;
};

window.selectQvSize = function (btn, size) {
  btn.parentElement.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
};

window.handleQvAdd = function (productId) {
  const activeColorBtn = document.querySelector(".color-option-btn.active");
  const activeSizeBtn = document.querySelector(".size-picker-group .size-btn.active");
  const color = activeColorBtn ? activeColorBtn.querySelector("span:last-child").textContent : null;
  const size = activeSizeBtn ? activeSizeBtn.textContent : null;

  addToCart(productId, size, color, 1);
  closeModal(document.getElementById("quickViewModal"));
};

/* ==========================================================================
   7. SIZE GUIDE MODAL (CM / INCHES CONVERSIONS)
   ========================================================================== */
function initSizeGuide() {
  const modal = document.getElementById("sizeGuideModal");
  if (!modal) return;

  const unitBtns = modal.querySelectorAll(".unit-btn");
  unitBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      unitBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const unit = btn.getAttribute("data-unit");
      toggleSizeUnits(unit);
    });
  });
}

function toggleSizeUnits(unit) {
  const table = document.getElementById("sizeGuideTable");
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");
  // Measurements data: [Chest, Waist, Overarm, Inseam] in Inches
  const inchData = [
    ["36R", "36\"", "30\"", "32\"", "31\""],
    ["38R", "38\"", "32\"", "33\"", "31.5\""],
    ["40R", "40\"", "34\"", "34\"", "32\""],
    ["42R", "42\"", "36\"", "35\"", "32.5\""],
    ["44R", "44\"", "38\"", "36\"", "33\""],
    ["46R", "46\"", "40\"", "37\"", "33\""]
  ];

  // In Centimeters
  const cmData = [
    ["36R", "91 cm", "76 cm", "81 cm", "79 cm"],
    ["38R", "96 cm", "81 cm", "84 cm", "80 cm"],
    ["40R", "101 cm", "86 cm", "86 cm", "81 cm"],
    ["42R", "106 cm", "91 cm", "89 cm", "82 cm"],
    ["44R", "112 cm", "96 cm", "91 cm", "84 cm"],
    ["46R", "117 cm", "101 cm", "94 cm", "84 cm"]
  ];

  const activeDataset = unit === "cm" ? cmData : inchData;

  rows.forEach((row, idx) => {
    const data = activeDataset[idx];
    if (data) {
      const cells = row.querySelectorAll("td");
      data.forEach((val, cIdx) => {
        if (cells[cIdx]) cells[cIdx].textContent = val;
      });
    }
  });
}

function openSizeGuide() {
  const modal = document.getElementById("sizeGuideModal");
  if (modal) openModal(modal);
}

/* ==========================================================================
   8. GENERIC MODAL CONTROLLER
   ========================================================================== */
function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  document.body.classList.add("modal-open");

  // Hook up close button
  const closeBtn = modal.querySelector(".modal-close-btn");
  if (closeBtn) {
    closeBtn.onclick = () => closeModal(modal);
  }

  // Hook up backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) closeModal(modal);
  };
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

// Global ESC key listener for modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.active").forEach(closeModal);
    closeCartDrawer();
  }
});

/* ==========================================================================
   9. ACCORDIONS ENGINE
   ========================================================================== */
function initAccordions() {
  document.addEventListener("click", (e) => {
    const header = e.target.closest(".accordion-header");
    if (!header) return;

    const item = header.closest(".accordion-item");
    if (!item) return;

    const isActive = item.classList.contains("active");

    // Optional: close other accordion items in the same group
    const parent = item.parentElement;
    if (parent.dataset.single === "true") {
      parent.querySelectorAll(".accordion-item").forEach((el) => el.classList.remove("active"));
    }

    if (isActive) {
      item.classList.remove("active");
    } else {
      item.classList.add("active");
    }
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
let toastTimeout;
function initToast() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

function showToast(message, icon = "✨") {
  const container = document.querySelector(".toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   11. HOME PAGE INITIALIZATION (`index.html`)
   ========================================================================== */
function initHomePage() {
  const featuredContainer = document.getElementById("featuredSuitsGrid");
  if (!featuredContainer) return;

  // Render top 4 featured suits
  const featured = RAJA_PRODUCTS.slice(0, 4);
  featuredContainer.innerHTML = featured.map(createProductCardHTML).join("");
  updateWishlistIcons();

  // Newsletter subscription
  const newsForm = document.getElementById("homeNewsletterForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsForm.querySelector("input[type='email']");
      if (input && input.value.trim()) {
        showToast("Welcome to The Connoisseurs Club. Your invitation is on its way.");
        input.value = "";
      }
    });
  }
}

/* ==========================================================================
   12. SHOP / PRODUCTS PAGE (`products.html`)
   ========================================================================== */
function initShopPage() {
  const grid = document.getElementById("shopProductsGrid");
  const countEl = document.getElementById("productsCountText");
  const searchInput = document.getElementById("shopSearchInput");
  const sortSelect = document.getElementById("shopSortSelect");
  const priceSlider = document.getElementById("priceSlider");
  const priceDisplay = document.getElementById("priceSliderValue");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

  // Read URL query parameters (e.g. ?category=Wedding or ?search=... or ?view=wishlist)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category");
  const initialSearch = urlParams.get("search");
  const isWishlistView = urlParams.get("view") === "wishlist";

  if (isWishlistView) {
    const heroTitle = document.querySelector(".shop-hero h1");
    const heroDesc = document.querySelector(".shop-hero p");
    const breadcrumbCurrent = document.querySelector(".breadcrumbs span:last-child");
    if (heroTitle) heroTitle.textContent = "Your Curated Wishlist";
    if (heroDesc) heroDesc.textContent = "Review garments and sartorial pieces you have earmarked for your personal wardrobe.";
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Saved Wishlist";
  }

  if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
  }

  // Pre-check category checkbox if matched
  if (initialCategory) {
    const matchBox = document.querySelector(`.filter-checkbox[value="${initialCategory}"]`);
    if (matchBox) matchBox.checked = true;
  }

  function applyFilters() {
    let filtered = [...RAJA_PRODUCTS];

    // Dedicated Wishlist Filter
    if (isWishlistView) {
      const wishlistIds = getWishlist();
      filtered = filtered.filter((p) => wishlistIds.includes(p.id));
    }

    // Search text filter
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.subCategory.toLowerCase().includes(query) ||
          p.shortDesc.toLowerCase().includes(query)
      );
    }

    // Category checkboxes
    const checkedCategories = Array.from(document.querySelectorAll(".filter-checkbox:checked")).map((cb) => cb.value);
    if (checkedCategories.length > 0) {
      filtered = filtered.filter((p) => checkedCategories.includes(p.category) || checkedCategories.includes(p.subCategory));
    }

    // Price range slider
    if (priceSlider) {
      const maxPrice = parseInt(priceSlider.value, 10);
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Size filter pills
    const activeSizeBtn = document.querySelector(".size-pill-btn.active");
    if (activeSizeBtn) {
      const chosenSize = activeSizeBtn.getAttribute("data-size");
      filtered = filtered.filter((p) => p.sizes.includes(chosenSize));
    }

    // Color swatches filter
    const activeColorBtn = document.querySelector(".color-swatch-filter.active");
    if (activeColorBtn) {
      const chosenColor = activeColorBtn.getAttribute("data-color");
      filtered = filtered.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes(chosenColor.toLowerCase())));
    }

    // Sorting
    const sortVal = sortSelect ? sortSelect.value : "featured";
    if (sortVal === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === "newest") {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    // Update Counter
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${isWishlistView ? getWishlist().length : RAJA_PRODUCTS.length} masterworks`;
    }

    // Render Grid
    if (grid) {
      if (filtered.length === 0) {
        if (isWishlistView) {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--accent-gold); opacity: 0.85;">♡</div>
              <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Your Wishlist is Currently Empty</h3>
              <p style="margin: 0.75rem auto 1.75rem; color: var(--text-muted); max-width: 480px;">
                Click the heart icon on any suit, dinner jacket, or silk accessory to save your favorites to your personal bespoke lookbook.
              </p>
              <a href="products.html" class="btn btn-primary">Explore The Catalog</a>
            </div>
          `;
        } else {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
              <h3>No Garments Match Your Selection</h3>
              <p style="margin: 0.75rem 0 1.5rem; color: var(--text-muted);">
                Adjust your filters or reset to view our full collection of suits and formalwear.
              </p>
              <button type="button" class="btn btn-secondary" onclick="resetAllShopFilters()">Reset All Filters</button>
            </div>
          `;
        }
      } else {
        grid.innerHTML = filtered.map(createProductCardHTML).join("");
        updateWishlistIcons();
      }
    }
  }

  // Bind Listeners
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      priceDisplay.textContent = `$${parseInt(e.target.value, 10).toLocaleString()}`;
      applyFilters();
    });
  }

  document.querySelectorAll(".filter-checkbox").forEach((cb) => {
    cb.addEventListener("change", applyFilters);
  });

  // Size filter pill clicks
  document.querySelectorAll(".size-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
      } else {
        document.querySelectorAll(".size-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
      applyFilters();
    });
  });

  // Color swatch filter clicks
  document.querySelectorAll(".color-swatch-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
      } else {
        document.querySelectorAll(".color-swatch-filter").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
      applyFilters();
    });
  });

  // View mode switcher (3-col, 4-col, list)
  document.querySelectorAll(".view-mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".view-mode-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.getAttribute("data-mode");
      if (grid) {
        grid.classList.remove("grid-3", "grid-4", "list-view");
        grid.classList.add(mode);
      }
    });
  });

  // Clear filters
  window.resetAllShopFilters = function () {
    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "featured";
    document.querySelectorAll(".filter-checkbox").forEach((cb) => (cb.checked = false));
    document.querySelectorAll(".size-pill-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".color-swatch-filter").forEach((b) => b.classList.remove("active"));
    if (priceSlider && priceDisplay) {
      priceSlider.value = priceSlider.max;
      priceDisplay.textContent = `$${parseInt(priceSlider.max, 10).toLocaleString()}`;
    }
    applyFilters();
  };

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", resetAllShopFilters);
  }

  // Initial run
  applyFilters();
}

/* ==========================================================================
   13. PRODUCT DETAIL PAGE (`product.html`)
   ========================================================================== */
function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "rw-01";
  const product = RAJA_PRODUCTS.find((p) => p.id === productId) || RAJA_PRODUCTS[0];

  // Update Page Title
  document.title = `${product.name} | Raja's Wear Luxury Formalwear`;

  // Breadcrumbs
  const crumbCat = document.getElementById("pdpCrumbCategory");
  const crumbName = document.getElementById("pdpCrumbName");
  if (crumbCat) crumbCat.textContent = product.category;
  if (crumbName) crumbName.textContent = product.name;

  // Gallery Main & Thumbs
  const mainImg = document.getElementById("pdpMainImage");
  const thumbsContainer = document.getElementById("pdpThumbnails");
  if (mainImg) mainImg.src = product.images[0];

  if (thumbsContainer) {
    thumbsContainer.innerHTML = product.images
      .map(
        (img, idx) => `
        <div class="gallery-thumb ${idx === 0 ? "active" : ""}" onclick="switchPdpImage(this, '${img}')">
          <img src="${img}" alt="${product.name} angle ${idx + 1}" />
        </div>
      `
      )
      .join("");
  }

  // Product Meta
  const catEl = document.getElementById("pdpCategory");
  const titleEl = document.getElementById("pdpTitle");
  const ratingEl = document.getElementById("pdpRating");
  const reviewCountEl = document.getElementById("pdpReviewCount");
  const priceCurrentEl = document.getElementById("pdpPriceCurrent");
  const priceOldEl = document.getElementById("pdpPriceOld");
  const discountTagEl = document.getElementById("pdpDiscountTag");
  const descEl = document.getElementById("pdpDescription");

  if (catEl) catEl.textContent = `${product.category} • ${product.subCategory}`;
  if (titleEl) titleEl.textContent = product.name;
  if (ratingEl) ratingEl.textContent = product.rating;
  if (reviewCountEl) reviewCountEl.textContent = `(${product.reviewCount} reviews)`;
  if (priceCurrentEl) priceCurrentEl.textContent = `$${product.price.toLocaleString()}`;

  if (priceOldEl && discountTagEl) {
    if (product.oldPrice) {
      priceOldEl.textContent = `$${product.oldPrice.toLocaleString()}`;
      priceOldEl.style.display = "inline";
      const savings = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      discountTagEl.textContent = `Save ${savings}%`;
      discountTagEl.style.display = "inline-block";
    } else {
      priceOldEl.style.display = "none";
      discountTagEl.style.display = "none";
    }
  }

  if (descEl) descEl.textContent = product.shortDesc;

  // Colors
  const colorContainer = document.getElementById("pdpColorSwatches");
  const colorLabel = document.getElementById("pdpSelectedColorName");
  if (colorLabel && product.colors[0]) colorLabel.textContent = product.colors[0].name;

  if (colorContainer) {
    colorContainer.innerHTML = product.colors
      .map(
        (c, idx) => `
        <button type="button" class="color-option-btn ${idx === 0 ? "active" : ""}" onclick="selectPdpColor(this, '${c.name}')">
          <span class="color-dot" style="background-color: ${c.hex};"></span>
          <span>${c.name}</span>
        </button>
      `
      )
      .join("");
  }

  // Sizes
  const sizeContainer = document.getElementById("pdpSizeButtons");
  if (sizeContainer) {
    sizeContainer.innerHTML = product.sizes
      .map(
        (s, idx) => `
        <button type="button" class="size-btn ${idx === 0 ? "active" : ""}" onclick="selectPdpSize(this, '${s}')">${s}</button>
      `
      )
      .join("");
  }

  // Accordion Details Specs
  const specFabric = document.getElementById("pdpSpecFabric");
  const specFit = document.getElementById("pdpSpecFit");
  const specConstruction = document.getElementById("pdpSpecConstruction");
  const specCare = document.getElementById("pdpSpecCare");
  const specDetailsList = document.getElementById("pdpSpecDetailsList");

  if (specFabric) specFabric.textContent = product.fabric;
  if (specFit) specFit.textContent = product.fit;
  if (specConstruction) specConstruction.textContent = product.construction;
  if (specCare) specCare.textContent = product.care;

  if (specDetailsList && product.details) {
    specDetailsList.innerHTML = product.details.map((d) => `<li>• ${d}</li>`).join("");
  }

  // Wishlist button on PDP
  const pdpWishBtn = document.getElementById("pdpWishlistBtn");
  if (pdpWishBtn) {
    pdpWishBtn.setAttribute("data-wishlist-id", product.id);
  }

  // Add to Bag CTA
  const addToBagBtn = document.getElementById("pdpAddToBagBtn");
  if (addToBagBtn) {
    addToBagBtn.onclick = () => {
      const activeColor = document.querySelector("#pdpColorSwatches .color-option-btn.active span:last-child");
      const activeSize = document.querySelector("#pdpSizeButtons .size-btn.active");
      const qtyInput = document.getElementById("pdpQuantityInput");

      const chosenColor = activeColor ? activeColor.textContent : product.colors[0]?.name;
      const chosenSize = activeSize ? activeSize.textContent : product.sizes[0];
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      addToCart(product.id, chosenSize, chosenColor, qty);
    };
  }

  // Render "You May Also Like" (exclude current product)
  const relatedGrid = document.getElementById("pdpRelatedGrid");
  if (relatedGrid) {
    const related = RAJA_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
    relatedGrid.innerHTML = related.map(createProductCardHTML).join("");
  }

  updateWishlistIcons();
}

window.switchPdpImage = function (thumb, src) {
  document.querySelectorAll(".gallery-thumb").forEach((t) => t.classList.remove("active"));
  thumb.classList.add("active");
  const main = document.getElementById("pdpMainImage");
  if (main) main.src = src;
};

window.selectPdpColor = function (btn, colorName) {
  document.querySelectorAll("#pdpColorSwatches .color-option-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const label = document.getElementById("pdpSelectedColorName");
  if (label) label.textContent = colorName;
};

window.selectPdpSize = function (btn, size) {
  document.querySelectorAll("#pdpSizeButtons .size-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
};

window.adjustPdpQty = function (delta) {
  const input = document.getElementById("pdpQuantityInput");
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
};

/* ==========================================================================
   14. DEDICATED CART PAGE (`cart.html`)
   ========================================================================== */
function initCartPage() {
  renderCartPageItems();

  // Promo Code Button & Input
  const applyPromoBtn = document.getElementById("applyPromoBtn");
  const promoInput = document.getElementById("cartPromoInput");
  const promoStatus = document.getElementById("promoStatusMessage");

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const code = promoInput.value.trim().toUpperCase();

      if (code === "ROYAL10" || code === "RAJA10") {
        localStorage.setItem(PROMO_STORAGE_KEY, "RAJA10");
        if (promoStatus) {
          promoStatus.style.color = "#4ade80";
          promoStatus.textContent = "✓ Privilege applied: 10% Bespoke Concession granted.";
        }
        showToast("Code applied: 10% VIP concession granted!");
        renderCartPageItems();
      } else if (code === "RAJA20") {
        localStorage.setItem(PROMO_STORAGE_KEY, "RAJA20");
        if (promoStatus) {
          promoStatus.style.color = "#4ade80";
          promoStatus.textContent = "✓ Privilege applied: 20% Atelier Concession granted.";
        }
        showToast("Code applied: 20% Atelier concession granted!");
        renderCartPageItems();
      } else {
        if (promoStatus) {
          promoStatus.style.color = "#ef4444";
          promoStatus.textContent = "✕ Unrecognized code. Try ROYAL10 or RAJA20.";
        }
        showToast("Invalid code. Try ROYAL10 or RAJA20.", "⚠️");
      }
    });
  }

  // Proceed to Checkout modal trigger
  const checkoutTrigger = document.getElementById("proceedToCheckoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  if (checkoutTrigger && checkoutModal) {
    checkoutTrigger.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        showToast("Your shopping bag is empty.", "🛍️");
        return;
      }
      const { total } = getCartCalculations();
      const modalTotalDisplay = document.getElementById("checkoutModalTotalDisplay");
      if (modalTotalDisplay) {
        modalTotalDisplay.textContent = `$${total.toLocaleString()}`;
      }
      openModal(checkoutModal);
    });
  }

  // Demo Checkout Form Submission
  const checkoutForm = document.getElementById("demoCheckoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleDemoCheckout(checkoutForm);
    });
  }
}

window.clearFullCart = function () {
  if (confirm("Are you certain you wish to empty your shopping bag?")) {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PROMO_STORAGE_KEY);
    updateCartBadges();
    renderCartDrawer();
    renderCartPageItems();
    showToast("Shopping bag cleared.", "🛍️");
  }
};

window.closeCheckoutModal = function () {
  const modal = document.getElementById("checkoutModal");
  if (modal) closeModal(modal);
};

function renderCartPageItems() {
  const emptyView = document.getElementById("cartEmptyState");
  const filledView = document.getElementById("cartFilledState") || document.getElementById("cartPageContent");
  const itemsContainer = document.getElementById("cartPageItemsContainer") || document.getElementById("cartTableBody");
  const totalCountEl = document.getElementById("cartTotalItemsCount");

  const subtotalEl = document.getElementById("summarySubtotal");
  const shippingEl = document.getElementById("summaryShipping");
  const discountRow = document.getElementById("summaryDiscountRow");
  const discountPercentEl = document.getElementById("summaryDiscountPercent");
  const discountAmountEl = document.getElementById("summaryDiscountAmount") || document.getElementById("summaryDiscount");
  const taxEl = document.getElementById("summaryTax");
  const grandTotalEl = document.getElementById("summaryGrandTotal") || document.getElementById("summaryTotal");

  const progressBar = document.getElementById("cartShippingProgressBar");
  const progressText = document.getElementById("cartShippingProgressText");

  const cart = getCart();
  const { itemCount, subtotal, shippingFee, shippingLeft, freeShippingThreshold, discount, activePromo, tax, total } = getCartCalculations();

  if (totalCountEl) totalCountEl.textContent = itemCount;

  if (cart.length === 0) {
    if (emptyView) emptyView.style.display = "block";
    if (filledView) filledView.style.display = "none";
    return;
  }

  if (emptyView) emptyView.style.display = "none";
  if (filledView) filledView.style.display = "grid";

  // Financial calculations
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
  if (shippingEl) shippingEl.textContent = shippingFee === 0 ? "Complimentary" : `$${shippingFee}`;
  if (taxEl) taxEl.textContent = `$${tax.toLocaleString()}`;
  if (grandTotalEl) grandTotalEl.textContent = `$${total.toLocaleString()}`;

  // Discount row
  if (discountRow) {
    if (discount > 0) {
      discountRow.style.display = "flex";
      if (discountPercentEl) {
        discountPercentEl.textContent = activePromo === "RAJA20" ? "20%" : "10%";
      }
      if (discountAmountEl) {
        discountAmountEl.textContent = `-$${discount.toLocaleString()}`;
      }
    } else {
      discountRow.style.display = "none";
    }
  }

  // Shipping progress
  if (progressBar && progressText) {
    if (subtotal === 0) {
      progressBar.style.width = "0%";
      progressText.textContent = `Add $${freeShippingThreshold} for complimentary global shipping`;
    } else if (shippingLeft > 0) {
      const pct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      progressBar.style.width = `${pct}%`;
      progressText.textContent = `Add $${shippingLeft} more for complimentary global shipping`;
    } else {
      progressBar.style.width = "100%";
      progressText.textContent = "✨ You have unlocked Complimentary Worldwide DHL Express Shipping!";
    }
  }

  // Render items list
  if (itemsContainer) {
    itemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-page-item" style="display: flex; gap: 1.5rem; padding: 1.5rem 0; border-bottom: 1px solid var(--border-subtle); align-items: center;">
          <a href="product.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" style="width: 84px; height: 112px; object-fit: cover; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);" />
          </a>
          <div style="flex-grow: 1;">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem;">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h4>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
              <span>Size: <strong>${item.size}</strong></span> &nbsp;&bull;&nbsp; 
              <span>Color: <strong>${item.color}</strong></span>
            </div>
            <div style="font-weight: 700; color: var(--accent-gold); font-size: 1.05rem;">
              $${(item.price * item.quantity).toLocaleString()} 
              ${item.quantity > 1 ? `<span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 400;">($${item.price.toLocaleString()} each)</span>` : ""}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem;">
            <div class="quantity-stepper" style="height: 38px; width: 105px;">
              <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.cartItemId}', -1)" aria-label="Decrease quantity">−</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly aria-label="Quantity" />
              <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.cartItemId}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" onclick="removeFromCart('${item.cartItemId}')" style="font-size: 0.8rem; color: var(--text-muted); text-decoration: underline; cursor: pointer; background: none; border: none;">
              Remove
            </button>
          </div>
        </div>
      `
      )
      .join("");
  }
}

function handleDemoCheckout(form) {
  const firstName = form.querySelector("#checkoutFirstName") ? form.querySelector("#checkoutFirstName").value.trim() : "Alexander";
  const lastName = form.querySelector("#checkoutLastName") ? form.querySelector("#checkoutLastName").value.trim() : "Montgomery";
  const address = form.querySelector("#checkoutAddress") ? form.querySelector("#checkoutAddress").value.trim() : "48 Berkeley Square, Mayfair";
  const city = form.querySelector("#checkoutCity") ? form.querySelector("#checkoutCity").value.trim() : "London";
  const country = form.querySelector("#checkoutCountry") ? form.querySelector("#checkoutCountry").value : "United Kingdom";

  const { total } = getCartCalculations();
  const orderId = `RW-${Math.floor(10000 + Math.random() * 90000)}`;

  // Close checkout modal
  const checkoutModal = document.getElementById("checkoutModal");
  if (checkoutModal) closeModal(checkoutModal);

  // Clear cart
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(PROMO_STORAGE_KEY);
  updateCartBadges();
  renderCartDrawer();
  renderCartPageItems();

  // Populate Receipt Modal
  const receiptModal = document.getElementById("orderReceiptModal");
  const nameEl = document.getElementById("receiptCustomerName");
  const orderEl = document.getElementById("receiptOrderNumber");
  const destEl = document.getElementById("receiptDestination");
  const paidEl = document.getElementById("receiptTotalPaid");

  if (nameEl) nameEl.textContent = `${firstName} ${lastName}`;
  if (orderEl) orderEl.textContent = orderId;
  if (destEl) destEl.textContent = `${city}, ${country}`;
  if (paidEl) paidEl.textContent = `$${total.toLocaleString()}`;

  if (receiptModal) {
    openModal(receiptModal);
  }

  showToast(`Commission confirmed! Reference: ${orderId}`, "✨");
}

/* ==========================================================================
   15. CONTACT PAGE VALIDATION (`contact.html`)
   ========================================================================== */
function initContactPage() {
  const form = document.getElementById("contactConciergeForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = form.querySelector("[name='name']");
    const emailInput = form.querySelector("[name='email']");
    const messageInput = form.querySelector("[name='message']");

    // Validate Name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, "Please enter your full name.");
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setFieldError(messageInput, "Please share a few details about your inquiry (at least 10 characters).");
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    if (isValid) {
      const submitBtn = form.querySelector("button[type='submit']");
      const originalBtnText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Transmitting...";
      }

      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            const parent = form.parentElement;
            parent.innerHTML = `
              <div style="background: var(--bg-card); border: 1px solid var(--border-accent); border-radius: 8px; padding: 3rem; text-align: center;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent-gold);">✨</div>
                <h3 style="font-size: 1.8rem; margin-bottom: 0.75rem;">Concierge Appointment Received</h3>
                <p style="font-size: 1rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.7;">
                  Thank you, <strong>${nameInput.value.trim()}</strong>. Our master fitting director will contact you within 24 business hours to arrange your private consultation.
                </p>
                <a href="products.html" class="btn btn-secondary btn-sm">Explore Garments</a>
              </div>
            `;
            showToast("Your fitting request has been transmitted.");
          } else {
            throw new Error("Form submission failed");
          }
        })
        .catch(() => {
          showToast("Something went wrong sending your request. Please try again or email us directly.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    }
  });

  function setFieldError(input, msg) {
    const group = input.closest(".form-group");
    if (!group) return;
    group.classList.add("has-error");
    const err = group.querySelector(".form-error");
    if (err) err.textContent = msg;
  }

  function clearFieldError(input) {
    const group = input.closest(".form-group");
    if (!group) return;
    group.classList.remove("has-error");
  }
}

function initAboutPage() {
  // Can include custom animations or interactive counters if needed
}

/* ==========================================================================
   16. PRODUCT CARD HTML GENERATOR HELPER
   ========================================================================== */
function createProductCardHTML(product) {
  const isWish = getWishlist().includes(product.id);
  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card-media">
        <img src="${product.images[0]}" alt="${product.name}" class="product-card-img" loading="lazy" />
        
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}

        <div class="product-card-actions">
          <button type="button" class="card-action-btn ${isWish ? "wishlisted" : ""}" data-wishlist-id="${product.id}" aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button type="button" class="card-action-btn" data-quickview-id="${product.id}" aria-label="Quick View">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        <div class="product-card-quick-add">
          <button type="button" class="btn btn-primary btn-sm btn-full" onclick="addToCart('${product.id}')">
            Add to Bag
          </button>
        </div>
      </div>

      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-category">${product.category}</span>
          <div class="product-rating">
            <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span>${product.rating}</span>
          </div>
        </div>

        <h3 class="product-card-title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>

        <div class="product-card-swatches">
          ${product.colors
            .map((c) => `<span class="color-dot" style="background-color: ${c.hex};" title="${c.name}"></span>`)
            .join("")}
        </div>

        <div class="product-card-pricing">
          <span class="price-current">$${product.price.toLocaleString()}</span>
          ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toLocaleString()}</span>` : ""}
        </div>
      </div>
    </article>
  `;
}
