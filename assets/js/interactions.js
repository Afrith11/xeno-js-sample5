/**
 * ATELIER 404 - AVANT-GARDE INTERACTION DESIGN SYSTEM
 * Custom cursor, 404 Interactive Experiment, Quick View, Text Scramble, and Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initThe404Experiment();
  initQuickViewModal();
  initScrollAnimations();
  initTextScramble();
});

// Custom Desktop Cursor
function initCustomCursor() {
  // Only on pointer-fine devices and when reduced motion is not requested
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let cursorDot = document.getElementById('custom-cursor-dot');
  let cursorRing = document.getElementById('custom-cursor-ring');

  if (!cursorDot || !cursorRing) {
    cursorDot = document.createElement('div');
    cursorDot.id = 'custom-cursor-dot';
    cursorDot.className = 'custom-cursor-dot';

    cursorRing = document.createElement('div');
    cursorRing.id = 'custom-cursor-ring';
    cursorRing.className = 'custom-cursor-ring';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  // Smooth lerp loop for outer ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states on interactive elements
  const hoverSelectors = 'a, button, input, [data-action], .gallery-object-card, .drop-tile, .collection-card, .swatch-btn';

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target) {
      cursorRing.classList.add('cursor-expanded');
      if (target.closest('.gallery-image-wrapper') || target.closest('.drop-tile-visual')) {
        cursorRing.classList.add('cursor-drag');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverSelectors);
    if (target) {
      cursorRing.classList.remove('cursor-expanded', 'cursor-drag');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

// Section D: The 404 Experiment Interactive Installation
function initThe404Experiment() {
  const container = document.getElementById('experiment-404-container');
  if (!container) return;

  const typography = container.querySelector('.experiment-typography');
  const visuals = container.querySelector('.experiment-visual-stack');
  const readout = document.getElementById('experiment-coords-readout');
  const toggleXRayBtn = document.getElementById('toggle-xray-btn');
  const glitchTrigger = document.getElementById('trigger-glitch-btn');

  // Mouse move parallax and distortion
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    if (typography) {
      typography.style.transform = `translate3d(${deltaX * -25}px, ${deltaY * -15}px, 0)`;
    }

    if (visuals) {
      visuals.style.transform = `rotateY(${deltaX * 12}deg) rotateX(${-deltaY * 12}deg)`;
    }

    if (readout) {
      const distortion = Math.abs(deltaX * deltaY * 100).toFixed(1);
      readout.textContent = `LAT: ${(35.6762 + deltaX * 0.05).toFixed(4)}° N // LON: ${(139.6503 + deltaY * 0.05).toFixed(4)}° E // DISTORTION: ${distortion}%`;
    }
  });

  container.addEventListener('mouseleave', () => {
    if (typography) typography.style.transform = 'translate3d(0, 0, 0)';
    if (visuals) visuals.style.transform = 'rotateY(0deg) rotateX(0deg)';
    if (readout) readout.textContent = 'SYSTEM: NOMINAL // VECTOR: [0, 0] // WAIT STATE';
  });

  // Toggle X-Ray mode
  if (toggleXRayBtn) {
    toggleXRayBtn.addEventListener('click', () => {
      container.classList.toggle('xray-active');
      const isActive = container.classList.contains('xray-active');
      toggleXRayBtn.textContent = isActive ? 'MODE: X-RAY WIREFRAME [ACTIVE]' : 'MODE: STANDARD RENDER';
      toggleXRayBtn.classList.toggle('btn-active-lime', isActive);
    });
  }

  // Trigger Glitch Pulse
  if (glitchTrigger) {
    glitchTrigger.addEventListener('click', () => {
      container.classList.add('glitch-active');
      setTimeout(() => container.classList.remove('glitch-active'), 800);
    });
  }
}

// Quick View Modal
function initQuickViewModal() {
  const modal = document.getElementById('atelier-quickview-modal');
  const closeBtn = document.querySelector('.quickview-modal-close');
  if (!modal) return;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action="quick-view"]');
    if (!trigger) return;
    e.preventDefault();
    const productId = trigger.getAttribute('data-id');
    const product = window.getProductById(productId);
    if (!product) return;

    openQuickView(product);
  });

  function openQuickView(p) {
    const imgEl = modal.querySelector('.qv-main-img');
    const codeEl = modal.querySelector('.qv-code');
    const titleEl = modal.querySelector('.qv-title');
    const priceEl = modal.querySelector('.qv-price');
    const descEl = modal.querySelector('.qv-desc');
    const sizesContainer = modal.querySelector('.qv-sizes');
    const colorsContainer = modal.querySelector('.qv-colors');
    const linkEl = modal.querySelector('.qv-full-link');
    const addBtn = modal.querySelector('.qv-add-btn');

    if (imgEl) imgEl.src = p.images[0];
    if (codeEl) codeEl.textContent = `${p.code} // ${p.collection.toUpperCase()}`;
    if (titleEl) titleEl.textContent = p.name;
    if (priceEl) priceEl.textContent = window.formatINR(p.price);
    if (descEl) descEl.textContent = p.description;
    if (linkEl) linkEl.href = `product.html?id=${p.id}`;

    let selectedSize = p.sizes[0] || 'ONE SIZE';
    let selectedColor = p.colors[0]?.name || 'Default';

    // Render sizes
    if (sizesContainer) {
      sizesContainer.innerHTML = p.sizes.map((s, idx) => `
        <button class="qv-size-btn ${idx === 0 ? 'is-selected' : ''}" data-size="${s}">${s}</button>
      `).join('');

      sizesContainer.querySelectorAll('.qv-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sizesContainer.querySelectorAll('.qv-size-btn').forEach(b => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
          selectedSize = btn.getAttribute('data-size');
        });
      });
    }

    // Render colors
    if (colorsContainer) {
      colorsContainer.innerHTML = p.colors.map((c, idx) => `
        <button class="qv-color-btn ${idx === 0 ? 'is-selected' : ''}" data-color="${c.name}" style="background-color: ${c.hex};" title="${c.name}"></button>
      `).join('');

      colorsContainer.querySelectorAll('.qv-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          colorsContainer.querySelectorAll('.qv-color-btn').forEach(b => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
          selectedColor = btn.getAttribute('data-color');
        });
      });
    }

    // Add to Bag action
    if (addBtn) {
      addBtn.onclick = () => {
        window.AtelierCart.addItem(p.id, selectedSize, selectedColor, 1);
        closeQuickView();
        window.openQuickCartDrawer();
      };
    }

    modal.classList.add('is-open');
    document.body.classList.add('scroll-locked');
  }

  function closeQuickView() {
    modal.classList.remove('is-open');
    document.body.classList.remove('scroll-locked');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeQuickView();
  });
}

// Scroll-triggered animations
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll, .section-manifesto, .drop-tile, .journal-card, .editorial-spread').forEach(el => {
    observer.observe(el);
  });
}

// Text Scramble Effect on Hover
function initTextScramble() {
  const chars = '!<>-_\\/[]{}—=+*^?#________404';
  const scrambleElements = document.querySelectorAll('[data-scramble]');

  scrambleElements.forEach(el => {
    const originalText = el.textContent;
    let interval = null;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 30);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(interval);
      el.textContent = originalText;
    });
  });
}
