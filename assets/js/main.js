/**
 * ATELIER 404 - CORE APPLICATION ARCHITECTURE
 * Master coordinator & shared interactive components
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveStatusClock();
  initBackToTop();
  initShopPageLogic();
  initCartPageLogic();
  initProductDetailsPageLogic();
  initContactFormLogic();
  initNewDropsCountdown();
});

// Live Status Pulse Clock
function initLiveStatusClock() {
  const clockEl = document.getElementById('live-status-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `UTC ${utcHours}:${utcMinutes}:${utcSeconds}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// Back to Top button
function initBackToTop() {
  const backBtn = document.querySelector('.btn-back-to-top');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Shop Page Filtering, Sorting & View Toggle Logic
function initShopPageLogic() {
  const shopGrid = document.getElementById('shop-products-grid');
  const filterPills = document.querySelectorAll('.shop-filter-pill');
  const sortSelect = document.getElementById('shop-sort-select');
  const viewToggles = document.querySelectorAll('.view-toggle-btn');
  const searchInput = document.getElementById('shop-inline-search');
  const resultsCounter = document.getElementById('shop-results-counter');

  if (!shopGrid || !window.ATELIER_PRODUCTS) return;

  let activeCategory = 'all';
  let activeSort = 'newest';
  let searchQuery = '';

  function renderProducts() {
    let items = [...window.ATELIER_PRODUCTS];

    // Filter by Category
    if (activeCategory !== 'all') {
      items = items.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by Inline Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'code') {
      items.sort((a, b) => a.code.localeCompare(b.code));
    } else {
      // Default newest / original order
    }

    if (resultsCounter) {
      resultsCounter.textContent = `[ ${items.length} OBJECTS REGISTERED ]`;
    }

    if (items.length === 0) {
      shopGrid.innerHTML = `
        <div class="shop-empty-notice">
          <div class="empty-code">OBJECT NOT FOUND [404]</div>
          <p>NO GARMENT MATCHES CURRENT FILTER PARAMETERS.</p>
          <button class="btn-small-lime" onclick="document.querySelector('.shop-filter-pill[data-category=\'all\']').click()">RESET FILTERS</button>
        </div>
      `;
      return;
    }

    shopGrid.innerHTML = items.map((p, idx) => `
      <article class="shop-product-card" data-category="${p.category}" data-id="${p.id}">
        <div class="shop-card-media-wrapper">
          <img src="${p.images[0]}" alt="${p.name}" class="shop-card-primary-img" loading="lazy" />
          ${p.images[1] ? `<img src="${p.images[1]}" alt="${p.name} secondary angle" class="shop-card-hover-img" loading="lazy" />` : ''}
          <div class="shop-card-badge-row">
            <span class="shop-code-tag">${p.code}</span>
            <button class="btn-wishlist-heart ${window.AtelierCart.isInWishlist(p.id) ? 'is-active' : ''}" 
                    aria-label="Save to Wishlist" 
                    onclick="event.preventDefault(); window.AtelierCart.toggleWishlist('${p.id}'); this.classList.toggle('is-active');">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          <div class="shop-hover-bar">
            <button class="btn-action-view" data-action="quick-view" data-id="${p.id}">QUICK VIEW</button>
            <button class="btn-action-add" onclick="event.preventDefault(); window.AtelierCart.addItem('${p.id}'); window.openQuickCartDrawer();">+ ADD TO BAG</button>
          </div>
        </div>
        <div class="shop-card-meta">
          <div class="shop-card-subline">
            <span class="shop-card-collection">${p.collection.toUpperCase()}</span>
            <span class="shop-card-stock">${p.stockCount <= 3 ? `[ ONLY ${p.stockCount} LEFT ]` : '[ IN ARCHIVE ]'}</span>
          </div>
          <h3 class="shop-card-title">
            <a href="product.html?id=${p.id}">${p.name}</a>
          </h3>
          <div class="shop-card-footer">
            <span class="shop-card-price">${window.formatINR(p.price)}</span>
            <div class="shop-card-colors">
              ${p.colors.map(c => `<span class="color-dot" style="background-color: ${c.hex};" title="${c.name}"></span>`).join('')}
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Filter click handling
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeCategory = pill.getAttribute('data-category');
      renderProducts();
    });
  });

  // Sort change handling
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderProducts();
    });
  }

  // Search input handling
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }

  // Grid / Asymmetric view toggle
  viewToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      viewToggles.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const viewMode = btn.getAttribute('data-view');
      shopGrid.setAttribute('data-view-mode', viewMode);
    });
  });

  // Initial render
  renderProducts();
}

// Product Details Page (product.html) Logic
function initProductDetailsPageLogic() {
  const pdpContainer = document.getElementById('atelier-pdp-container');
  if (!pdpContainer || !window.ATELIER_PRODUCTS) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'obj-404-01';
  const product = window.getProductById(productId);

  // Set page title
  document.title = `${product.name} — ATELIER 404`;

  // Populate Breadcrumb & Headings
  const codeEl = document.getElementById('pdp-object-code');
  const collectionEl = document.getElementById('pdp-collection-tag');
  const titleEl = document.getElementById('pdp-title');
  const priceEl = document.getElementById('pdp-price');
  const originalPriceEl = document.getElementById('pdp-original-price');
  const descEl = document.getElementById('pdp-description');
  const stockEl = document.getElementById('pdp-stock-status');
  const sizesContainer = document.getElementById('pdp-sizes-container');
  const colorsContainer = document.getElementById('pdp-colors-container');
  const specsContainer = document.getElementById('pdp-specs-grid');
  const thumbsContainer = document.getElementById('pdp-thumbnails');
  const mainImage = document.getElementById('pdp-main-image');
  const relatedGrid = document.getElementById('pdp-related-grid');

  if (codeEl) codeEl.textContent = product.code;
  if (collectionEl) collectionEl.textContent = `${product.collection.toUpperCase()} // EDITION 2026`;
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = window.formatINR(product.price);
  if (originalPriceEl && product.originalPrice) {
    originalPriceEl.textContent = window.formatINR(product.originalPrice);
  }
  if (descEl) descEl.textContent = product.description;
  if (stockEl) {
    stockEl.innerHTML = product.stockCount <= 3 
      ? `<span class="stock-critical">● CRITICAL STOCK: ONLY ${product.stockCount} PROTOTYPES REMAINING</span>`
      : `<span class="stock-stable">● ARCHIVE AVAILABLE // READY FOR DISPATCH</span>`;
  }

  // Populate Main Image & Thumbnails
  if (mainImage) mainImage.src = product.images[0];
  if (thumbsContainer) {
    thumbsContainer.innerHTML = product.images.map((src, i) => `
      <button class="pdp-thumb ${i === 0 ? 'is-active' : ''}" data-image="${src}" aria-label="View angle ${i + 1}">
        <img src="${src}" alt="${product.name} angle ${i + 1}" />
        <span class="pdp-thumb-idx">[0${i + 1}]</span>
      </button>
    `).join('');
  }

  // Populate Sizes
  let selectedSize = product.sizes[0] || 'ONE SIZE';
  if (sizesContainer) {
    sizesContainer.innerHTML = product.sizes.map((sz, idx) => `
      <button class="pdp-size-btn ${idx === 0 ? 'is-selected' : ''}" data-size="${sz}">
        ${sz}
      </button>
    `).join('');

    sizesContainer.querySelectorAll('.pdp-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizesContainer.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedSize = btn.getAttribute('data-size');
      });
    });
  }

  // Populate Colors
  let selectedColor = product.colors[0]?.name || 'Default';
  if (colorsContainer) {
    colorsContainer.innerHTML = product.colors.map((c, idx) => `
      <button class="pdp-color-chip ${idx === 0 ? 'is-selected' : ''}" data-color="${c.name}" title="${c.name}">
        <span class="chip-dot" style="background-color: ${c.hex};"></span>
        <span class="chip-name">${c.name}</span>
      </button>
    `).join('');

    colorsContainer.querySelectorAll('.pdp-color-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        colorsContainer.querySelectorAll('.pdp-color-chip').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedColor = btn.getAttribute('data-color');
      });
    });
  }

  // Technical Specs Grid
  if (specsContainer && product.specs) {
    specsContainer.innerHTML = Object.entries(product.specs).map(([label, val]) => `
      <div class="spec-row">
        <span class="spec-label">${label.toUpperCase()}:</span>
        <span class="spec-val">${val}</span>
      </div>
    `).join('');
  }

  // Quantity Stepper
  let currentQty = 1;
  const qtyInput = document.getElementById('pdp-qty-val');
  const qtyDec = document.getElementById('pdp-qty-dec');
  const qtyInc = document.getElementById('pdp-qty-inc');

  if (qtyDec) {
    qtyDec.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        if (qtyInput) qtyInput.textContent = currentQty;
      }
    });
  }

  if (qtyInc) {
    qtyInc.addEventListener('click', () => {
      if (currentQty < Math.min(product.stockCount || 5, 10)) {
        currentQty++;
        if (qtyInput) qtyInput.textContent = currentQty;
      }
    });
  }

  // Add to Bag Button
  const addToBagBtn = document.getElementById('pdp-add-to-bag-btn');
  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      window.AtelierCart.addItem(product.id, selectedSize, selectedColor, currentQty);
      window.openQuickCartDrawer();
    });
  }

  // Wishlist Button
  const wishlistBtn = document.getElementById('pdp-wishlist-btn');
  if (wishlistBtn) {
    if (window.AtelierCart.isInWishlist(product.id)) {
      wishlistBtn.classList.add('is-active');
      wishlistBtn.innerHTML = `<span>SAVED IN WISHLIST [✓]</span>`;
    }
    wishlistBtn.addEventListener('click', () => {
      const added = window.AtelierCart.toggleWishlist(product.id);
      wishlistBtn.classList.toggle('is-active', added);
      wishlistBtn.innerHTML = added ? `<span>SAVED IN WISHLIST [✓]</span>` : `<span>SAVE TO WISHLIST</span>`;
    });
  }

  // Related Objects Grid
  if (relatedGrid) {
    const related = window.ATELIER_PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = related.map(p => `
      <a href="product.html?id=${p.id}" class="related-card">
        <div class="related-img-wrap">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
          <span class="related-code">${p.code}</span>
        </div>
        <div class="related-info">
          <h4>${p.name}</h4>
          <span class="related-price">${window.formatINR(p.price)}</span>
        </div>
      </a>
    `).join('');
  }
}

// Shopping Bag / Cart Page (cart.html) Logic
function initCartPageLogic() {
  const cartTableBody = document.getElementById('cart-page-items');
  const cartSubtotalEl = document.getElementById('cart-page-subtotal');
  const cartTaxEl = document.getElementById('cart-page-tax');
  const cartShippingEl = document.getElementById('cart-page-shipping');
  const cartTotalEl = document.getElementById('cart-page-total');
  const promoInput = document.getElementById('cart-promo-input');
  const promoApplyBtn = document.getElementById('cart-promo-btn');
  const promoNoticeEl = document.getElementById('cart-promo-notice');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const checkoutModal = document.getElementById('atelier-checkout-modal');

  if (!cartTableBody) return;

  let activeDiscount = 0; // percentage or fixed
  let discountCode = '';
  let freeShipping = false;

  function renderCartPage() {
    const cart = window.AtelierCart.getCart();
    const subtotal = window.AtelierCart.getSubtotal();

    if (cart.length === 0) {
      document.getElementById('cart-content-wrapper').innerHTML = `
        <div class="cart-empty-fullscreen">
          <div class="empty-glitch-mark">[ 404 / NO ITEMS ]</div>
          <h2 class="empty-headline">YOUR SHOPPING BAG IS UNPOPULATED.</h2>
          <p class="empty-sub">Explore the capsule collections to acquire wearable digital objects.</p>
          <div class="empty-actions">
            <a href="shop.html" class="btn-atelier-primary">DISCOVER ARCHIVE</a>
            <a href="new-drops.html" class="btn-atelier-outline">VIEW CAPSULE 026</a>
          </div>
        </div>
      `;
      return;
    }

    cartTableBody.innerHTML = cart.map((item, index) => `
      <div class="cart-item-row" data-index="${index}">
        <div class="cart-col-thumb">
          <a href="product.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" />
          </a>
        </div>
        <div class="cart-col-info">
          <span class="cart-item-code">${item.code || 'OBJ-404'}</span>
          <h3 class="cart-item-title"><a href="product.html?id=${item.id}">${item.name}</a></h3>
          <div class="cart-item-attributes">
            <span>SIZE: ${item.size}</span>
            <span>COLOR: ${item.color}</span>
          </div>
          <div class="cart-item-price-mobile">${window.formatINR(item.price)}</div>
        </div>
        <div class="cart-col-price">
          ${window.formatINR(item.price)}
        </div>
        <div class="cart-col-qty">
          <div class="qty-stepper-full">
            <button class="qty-step-btn" onclick="window.AtelierCart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
            <span class="qty-step-val">${item.quantity}</span>
            <button class="qty-step-btn" onclick="window.AtelierCart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div class="cart-col-total">
          ${window.formatINR(item.price * item.quantity)}
        </div>
        <div class="cart-col-action">
          <button class="btn-remove-line" onclick="window.AtelierCart.removeItem(${index})" title="Remove item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    // Totals calculations
    const discountAmount = activeDiscount > 0 ? (subtotal * activeDiscount) : 0;
    const discountedSubtotal = subtotal - discountAmount;
    const tax = Math.round(discountedSubtotal * 0.12); // 12% GST
    const shipping = freeShipping || subtotal > 50000 ? 0 : 2500;
    const finalTotal = discountedSubtotal + tax + shipping;

    if (cartSubtotalEl) cartSubtotalEl.textContent = window.formatINR(subtotal);
    if (cartTaxEl) cartTaxEl.textContent = window.formatINR(tax);
    if (cartShippingEl) cartShippingEl.textContent = shipping === 0 ? 'COMPLIMENTARY' : window.formatINR(shipping);
    if (cartTotalEl) cartTotalEl.textContent = window.formatINR(finalTotal);
  }

  // Promo code
  if (promoApplyBtn && promoInput) {
    promoApplyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'ATELIER10') {
        activeDiscount = 0.10;
        discountCode = code;
        promoNoticeEl.innerHTML = `<span class="promo-valid">● VIP PASS ACCEPTED: 10% ARCHIVE DISCOUNT APPLIED</span>`;
        renderCartPage();
      } else if (code === 'FUTURE404') {
        freeShipping = true;
        discountCode = code;
        promoNoticeEl.innerHTML = `<span class="promo-valid">● CODE ACCEPTED: COMPLIMENTARY EXPRESS COURIER</span>`;
        renderCartPage();
      } else {
        promoNoticeEl.innerHTML = `<span class="promo-invalid">● INVALID PROTOCOL CODE. TRY: 'ATELIER10' OR 'FUTURE404'</span>`;
      }
    });
  }

  // Checkout modal
  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
      const orderRef = 'AT404-' + Math.floor(100000 + Math.random() * 900000);
      const subtotal = window.AtelierCart.getSubtotal();
      const refEl = document.getElementById('checkout-order-ref');
      const amtEl = document.getElementById('checkout-order-amount');

      if (refEl) refEl.textContent = orderRef;
      if (amtEl) amtEl.textContent = window.formatINR(subtotal);

      checkoutModal.classList.add('is-open');
      document.body.classList.add('scroll-locked');

      // Clear cart on completion
      window.AtelierCart.clearCart();
    });

    const closeCheckoutBtn = document.querySelector('.checkout-modal-close');
    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('is-open');
        document.body.classList.remove('scroll-locked');
        window.location.href = 'index.html';
      });
    }
  }

  window.addEventListener('atelier:cart-updated', renderCartPage);
  renderCartPage();
}

// Contact Page Logic
function initContactFormLogic() {
  const contactForm = document.getElementById('atelier-contact-form');
  const modal = document.getElementById('contact-success-modal');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'TRANSMITTING ENCRYPTED CIPHER...';
      btn.disabled = true;
    }

    setTimeout(() => {
      if (btn) {
        btn.textContent = 'TRANSMISSION CONFIRMED [✓]';
      }
      if (modal) {
        modal.classList.add('is-open');
        document.body.classList.add('scroll-locked');
      } else {
        alert('TRANSMISSION RECEIVED. ATELIER 404 CONCIERGE WILL RESPOND WITHIN 24 HOURS.');
      }
      contactForm.reset();
    }, 900);
  });

  const closeBtn = document.querySelector('.contact-modal-close');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('scroll-locked');
    });
  }
}

// New Drops Countdown Timer
function initNewDropsCountdown() {
  const countdownEl = document.getElementById('drops-live-countdown');
  if (!countdownEl) return;

  // 4 days from now fixed target
  const targetDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownEl.textContent = 'CAPSULE DEPLOYED // DROP CLOSED';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.textContent = `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
