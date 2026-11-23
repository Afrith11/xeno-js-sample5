/**
 * ATELIER 404 - CART & WISHLIST ENGINE
 * Persistent localStorage shopping state
 */

const CART_STORAGE_KEY = 'atelier_404_cart_v1';
const WISHLIST_STORAGE_KEY = 'atelier_404_wishlist_v1';

window.AtelierCart = {
  getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Cart parse error:', e);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent('atelier:cart-updated', { detail: { cart } }));
    } catch (e) {
      console.error('Cart save error:', e);
    }
  },

  addItem(productId, size = null, color = null, quantity = 1) {
    const product = window.getProductById(productId);
    if (!product) return false;

    const cart = this.getCart();
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'ONE SIZE';
    const selectedColor = color || (product.colors && product.colors[0].name) || 'Default';

    const existingIndex = cart.findIndex(item => 
      item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        addedAt: Date.now()
      });
    }

    this.saveCart(cart);
    this.showToast(`ADDED: ${product.name} [${selectedSize}]`);
    return true;
  },

  updateQuantity(index, quantity) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = Math.min(quantity, 10);
      }
      this.saveCart(cart);
    }
  },

  removeItem(index) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1)[0];
      this.saveCart(cart);
      this.showToast(`REMOVED: ${removed.name}`);
    }
  },

  clearCart() {
    this.saveCart([]);
  },

  getCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  },

  // Wishlist
  getWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveWishlist(list) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent('atelier:wishlist-updated', { detail: { wishlist: list } }));
    } catch (e) {}
  },

  toggleWishlist(productId) {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    const product = window.getProductById(productId);
    let added = false;

    if (index > -1) {
      list.splice(index, 1);
      this.showToast(`WISHLIST REMOVED: ${product ? product.name : productId}`);
    } else {
      list.push(productId);
      this.showToast(`WISHLIST SAVED: ${product ? product.name : productId}`);
      added = true;
    }

    this.saveWishlist(list);
    return added;
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.includes(productId);
  },

  updateBadges() {
    const cartCount = this.getCount();
    const wishlistCount = this.getWishlist().length;

    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'inline-flex' : 'none';
      el.classList.add('badge-pulse');
      setTimeout(() => el.classList.remove('badge-pulse'), 400);
    });

    document.querySelectorAll('.wishlist-count-badge').forEach(el => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
    });
  },

  showToast(message) {
    let container = document.getElementById('atelier-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'atelier-toast-container';
      container.className = 'atelier-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'atelier-toast';
    toast.innerHTML = `
      <span class="toast-indicator">●</span>
      <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
};

// Initialize badges on load
document.addEventListener('DOMContentLoaded', () => {
  window.AtelierCart.updateBadges();
});
