/**
 * ATELIER 404 - NAVIGATION & FLOATING PANELS SYSTEM
 * Left floating rail, right utility controls, search, wishlist drawer & mobile overlay
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavRail();
  initMobileNav();
  initSearchModal();
  initWishlistDrawer();
  initQuickCartDrawer();
  initAudioFeedback();
  highlightActiveLink();
});

// Highlight current active link in navigation
function highlightActiveLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('[data-nav-target]').forEach(link => {
    const target = link.getAttribute('data-nav-target');
    if (filename === target || (filename === '' && target === 'index.html') || (filename === 'collection.html' && target === 'collections.html')) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

// Left Navigation Rail
function initNavRail() {
  const rail = document.querySelector('.floating-nav-rail');
  const toggleBtn = document.querySelector('.nav-rail-toggle');
  if (!rail) return;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      rail.classList.toggle('rail-expanded');
      const isExpanded = rail.classList.contains('rail-expanded');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Allow expand on hover on desktop if configured
  rail.addEventListener('mouseenter', () => {
    if (window.innerWidth > 1024) {
      rail.classList.add('rail-hovered');
    }
  });

  rail.addEventListener('mouseleave', () => {
    if (window.innerWidth > 1024) {
      rail.classList.remove('rail-hovered');
    }
  });
}

// Mobile Full-screen Navigation Overlay
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-trigger');
  const menuOverlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!menuOverlay || !toggleBtn) return;

  function openMenu() {
    menuOverlay.classList.add('is-open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-locked');
  }

  function closeMenu() {
    menuOverlay.classList.remove('is-open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('scroll-locked');
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menuOverlay.classList.contains('is-open')) closeMenu();
      closeSearch();
      closeWishlist();
      closeQuickCart();
    }
  });

  // Close when clicking nav links inside mobile menu
  menuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// Search Modal
let searchModal = null;
function initSearchModal() {
  searchModal = document.getElementById('atelier-search-modal');
  const searchTriggers = document.querySelectorAll('[data-action="open-search"]');
  const searchClose = document.querySelector('.search-modal-close');
  const searchInput = document.getElementById('atelier-search-input');
  const searchResults = document.getElementById('search-results-container');
  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.add('is-open');
    document.body.classList.add('scroll-locked');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 150);
      renderSearchResults(searchInput.value.trim());
    }
  }

  window.closeSearch = function() {
    if (searchModal) {
      searchModal.classList.remove('is-open');
      document.body.classList.remove('scroll-locked');
    }
  };

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
  if (searchClose) searchClose.addEventListener('click', window.closeSearch);

  // Keyboard shortcut '/' to search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const products = window.ATELIER_PRODUCTS || [];

    if (!query) {
      // Show curated highlights
      searchResults.innerHTML = `
        <div class="search-suggestions-label">// ARCHIVE RECOMMENDATIONS [CAPSULE 026]</div>
        <div class="search-items-grid">
          ${products.slice(0, 4).map(renderSearchItem).join('')}
        </div>
      `;
      return;
    }

    const q = query.toLowerCase();
    const matches = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.tagline && p.tagline.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty-state">
          <div class="empty-code">ERROR 404</div>
          <div class="empty-text">NO OBJECT MATCHING "${query}" IN CURRENT REPOSITORY.</div>
          <div class="empty-sub">TRY SEARCHING: 'COAT', 'TITANIUM', 'TROUSER', 'VISOR', 'DROPS'</div>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = `
      <div class="search-suggestions-label">// FOUND ${matches.length} OBJECTS MATCHING "${query}"</div>
      <div class="search-items-grid">
        ${matches.map(renderSearchItem).join('')}
      </div>
    `;
  }

  function renderSearchItem(p) {
    return `
      <a href="product.html?id=${p.id}" class="search-result-card" onclick="closeSearch()">
        <div class="search-card-img-wrap">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
          <span class="search-card-tag">${p.code}</span>
        </div>
        <div class="search-card-info">
          <div class="search-card-meta">${p.collection.toUpperCase()} // ${p.category.toUpperCase()}</div>
          <h4 class="search-card-title">${p.name}</h4>
          <div class="search-card-price">${window.formatINR ? window.formatINR(p.price) : '₹' + p.price}</div>
        </div>
      </a>
    `;
  }
}

// Wishlist Slide-out Drawer
let wishlistDrawer = null;
function initWishlistDrawer() {
  wishlistDrawer = document.getElementById('atelier-wishlist-drawer');
  const wishlistTriggers = document.querySelectorAll('[data-action="open-wishlist"]');
  const wishlistClose = document.querySelector('.wishlist-drawer-close');
  const wishlistItems = document.getElementById('wishlist-drawer-items');
  if (!wishlistDrawer) return;

  function openWishlist() {
    renderWishlist();
    wishlistDrawer.classList.add('is-open');
    document.body.classList.add('scroll-locked');
  }

  window.closeWishlist = function() {
    if (wishlistDrawer) {
      wishlistDrawer.classList.remove('is-open');
      document.body.classList.remove('scroll-locked');
    }
  };

  wishlistTriggers.forEach(btn => btn.addEventListener('click', openWishlist));
  if (wishlistClose) wishlistClose.addEventListener('click', window.closeWishlist);

  window.addEventListener('atelier:wishlist-updated', () => {
    if (wishlistDrawer.classList.contains('is-open')) renderWishlist();
  });

  function renderWishlist() {
    if (!wishlistItems) return;
    const wishlistIds = window.AtelierCart.getWishlist();

    if (wishlistIds.length === 0) {
      wishlistItems.innerHTML = `
        <div class="drawer-empty-state">
          <div class="empty-icon">[ 00 ]</div>
          <p>YOUR ARCHIVE WISHLIST IS EMPTY.</p>
          <a href="shop.html" class="btn-atelier-primary" onclick="closeWishlist()">EXPLORE ARCHIVE</a>
        </div>
      `;
      return;
    }

    const itemsHTML = wishlistIds.map(id => {
      const p = window.getProductById(id);
      if (!p) return '';
      return `
        <div class="drawer-product-row">
          <div class="drawer-product-img">
            <img src="${p.images[0]}" alt="${p.name}" />
          </div>
          <div class="drawer-product-details">
            <div class="drawer-product-code">${p.code}</div>
            <h4 class="drawer-product-name">${p.name}</h4>
            <div class="drawer-product-price">${window.formatINR(p.price)}</div>
            <div class="drawer-product-actions">
              <button class="btn-small-lime" onclick="window.AtelierCart.addItem('${p.id}'); window.AtelierCart.toggleWishlist('${p.id}');">MOVE TO BAG</button>
              <button class="btn-small-ghost" onclick="window.AtelierCart.toggleWishlist('${p.id}')">REMOVE</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    wishlistItems.innerHTML = itemsHTML;
  }
}

// Quick Cart Slide-out Drawer
let quickCartDrawer = null;
function initQuickCartDrawer() {
  quickCartDrawer = document.getElementById('atelier-quick-cart-drawer');
  const cartTriggers = document.querySelectorAll('[data-action="open-cart"]');
  const cartClose = document.querySelector('.quick-cart-close');
  const cartItems = document.getElementById('quick-cart-items');
  const cartSubtotalEl = document.getElementById('quick-cart-subtotal');
  if (!quickCartDrawer) return;

  function openQuickCart() {
    renderCart();
    quickCartDrawer.classList.add('is-open');
    document.body.classList.add('scroll-locked');
  }

  window.openQuickCartDrawer = openQuickCart;

  window.closeQuickCart = function() {
    if (quickCartDrawer) {
      quickCartDrawer.classList.remove('is-open');
      document.body.classList.remove('scroll-locked');
    }
  };

  cartTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    // If on cart page itself, allow normal link or open drawer
    if (window.location.pathname.endsWith('cart.html')) return;
    e.preventDefault();
    openQuickCart();
  }));

  if (cartClose) cartClose.addEventListener('click', window.closeQuickCart);

  window.addEventListener('atelier:cart-updated', () => {
    if (quickCartDrawer.classList.contains('is-open')) renderCart();
  });

  function renderCart() {
    if (!cartItems) return;
    const cart = window.AtelierCart.getCart();
    const subtotal = window.AtelierCart.getSubtotal();

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = window.formatINR(subtotal);
    }

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="drawer-empty-state">
          <div class="empty-icon">[ 404 / 0 ]</div>
          <p>YOUR SHOPPING BAG IS CURRENTLY EMPTY.</p>
          <a href="shop.html" class="btn-atelier-primary" onclick="closeQuickCart()">EXPLORE COLLECTION</a>
        </div>
      `;
      return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
      <div class="drawer-product-row">
        <div class="drawer-product-img">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="drawer-product-details">
          <div class="drawer-product-code">${item.code || 'OBJ-404'}</div>
          <h4 class="drawer-product-name">${item.name}</h4>
          <div class="drawer-product-specs">SIZE: ${item.size} | COLOR: ${item.color}</div>
          <div class="drawer-product-price">${window.formatINR(item.price)}</div>
          
          <div class="drawer-product-stepper">
            <div class="qty-stepper-mini">
              <button onclick="window.AtelierCart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button onclick="window.AtelierCart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
            </div>
            <button class="btn-text-remove" onclick="window.AtelierCart.removeItem(${index})">REMOVE</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Micro Synthetic Audio Feedback (Web Audio API - zero external files)
function initAudioFeedback() {
  let audioCtx = null;
  let soundEnabled = false;

  const audioToggleBtn = document.querySelector('.audio-sound-toggle');

  function initCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playMicroBeep(freq = 880, type = 'sine', duration = 0.04) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initCtx();
      soundEnabled = !soundEnabled;
      audioToggleBtn.classList.toggle('sound-on', soundEnabled);
      audioToggleBtn.setAttribute('aria-pressed', soundEnabled);
      const label = audioToggleBtn.querySelector('.sound-toggle-label');
      if (label) label.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      if (soundEnabled) playMicroBeep(1200, 'triangle', 0.08);
    });
  }

  // Bind subtle interactions
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .product-card, .swatch-btn')) {
      playMicroBeep(980, 'sine', 0.03);
    }
  });
}
