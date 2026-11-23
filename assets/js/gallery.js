/**
 * ATELIER 404 - HORIZONTAL OBJECT EXHIBITION & PRODUCT GALLERY
 * High performance horizontal kinetic scrolling & interactive image viewers
 */

document.addEventListener('DOMContentLoaded', () => {
  initHorizontalObjectGallery();
  initProductPageGallery();
});

// Section C: The Object Gallery
function initHorizontalObjectGallery() {
  const galleryTrack = document.getElementById('horizontal-gallery-track');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  const progressBar = document.getElementById('gallery-scroll-progress');
  const counterEl = document.getElementById('gallery-counter');
  if (!galleryTrack) return;

  // Populate products if empty
  if (galleryTrack.children.length === 0 && window.ATELIER_PRODUCTS) {
    const galleryItems = window.ATELIER_PRODUCTS.filter(p => p.featuredInObjectGallery);
    galleryTrack.innerHTML = galleryItems.map((p, idx) => `
      <article class="gallery-object-card" data-index="${idx + 1}" data-id="${p.id}">
        <div class="gallery-card-inner">
          <div class="gallery-card-badge-row">
            <span class="gallery-obj-idx">[ ${String(idx + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')} ]</span>
            <span class="gallery-tag-pill">${p.tag || 'ARCHIVE'}</span>
          </div>

          <div class="gallery-image-wrapper">
            <img src="${p.images[0]}" alt="${p.name}" class="gallery-primary-img" loading="lazy" />
            ${p.images[1] ? `<img src="${p.images[1]}" alt="${p.name} alternate view" class="gallery-secondary-img" loading="lazy" />` : ''}
            
            <div class="gallery-hover-actions">
              <button class="btn-quick-view" data-action="quick-view" data-id="${p.id}">
                <span>QUICK VIEW</span>
              </button>
              <button class="btn-quick-add" onclick="window.AtelierCart.addItem('${p.id}'); window.openQuickCartDrawer();">
                <span>+ ADD TO BAG</span>
              </button>
            </div>
          </div>

          <div class="gallery-meta-panel">
            <div class="gallery-meta-top">
              <span class="gallery-item-code">${p.code}</span>
              <span class="gallery-item-category">${p.category.toUpperCase()}</span>
            </div>
            <h3 class="gallery-item-title">
              <a href="product.html?id=${p.id}">${p.name}</a>
            </h3>
            <p class="gallery-item-tagline">${p.tagline || ''}</p>
            <div class="gallery-item-bottom">
              <span class="gallery-item-price">${window.formatINR(p.price)}</span>
              <div class="gallery-swatches">
                ${(p.colors || []).map(c => `
                  <span class="mini-swatch" style="background-color: ${c.hex};" title="${c.name}"></span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Update progress and counter
  function updateGalleryState() {
    const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
    if (maxScroll <= 0) return;
    const progress = Math.min(Math.max(galleryTrack.scrollLeft / maxScroll, 0), 1);

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    if (counterEl) {
      const cardWidth = 380;
      const currentIndex = Math.min(Math.floor(galleryTrack.scrollLeft / cardWidth) + 1, 8);
      counterEl.textContent = `[ ${String(currentIndex).padStart(2, '0')} // 08 ]`;
    }

    if (prevBtn) prevBtn.disabled = galleryTrack.scrollLeft <= 10;
    if (nextBtn) nextBtn.disabled = galleryTrack.scrollLeft >= maxScroll - 10;
  }

  galleryTrack.addEventListener('scroll', updateGalleryState, { passive: true });
  window.addEventListener('resize', updateGalleryState);

  // Prev / Next button controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const scrollStep = Math.min(galleryTrack.clientWidth * 0.75, 500);
      galleryTrack.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const scrollStep = Math.min(galleryTrack.clientWidth * 0.75, 500);
      galleryTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  // Drag to scroll for desktop mice
  let isDown = false;
  let startX;
  let scrollLeftStart;

  galleryTrack.addEventListener('mousedown', (e) => {
    // Ignore clicks on buttons/links
    if (e.target.closest('button, a, input')) return;
    isDown = true;
    galleryTrack.classList.add('is-dragging');
    startX = e.pageX - galleryTrack.offsetLeft;
    scrollLeftStart = galleryTrack.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    galleryTrack.classList.remove('is-dragging');
  });

  galleryTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryTrack.offsetLeft;
    const walk = (x - startX) * 1.6;
    galleryTrack.scrollLeft = scrollLeftStart - walk;
  });

  // Initial update
  setTimeout(updateGalleryState, 100);
}

// Product Page Gallery
function initProductPageGallery() {
  const mainImage = document.getElementById('pdp-main-image');
  const thumbsContainer = document.getElementById('pdp-thumbnails');
  const angleSlider = document.getElementById('pdp-angle-slider');
  if (!mainImage) return;

  // Image zoom effect on hover
  const mainWrapper = mainImage.parentElement;
  if (mainWrapper && window.matchMedia('(pointer: fine)').matches) {
    mainWrapper.addEventListener('mousemove', (e) => {
      const rect = mainWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImage.style.transformOrigin = `${x}% ${y}%`;
      mainImage.style.transform = 'scale(1.4)';
    });

    mainWrapper.addEventListener('mouseleave', () => {
      mainImage.style.transformOrigin = 'center center';
      mainImage.style.transform = 'scale(1)';
    });
  }

  // Thumbnail click selection
  if (thumbsContainer) {
    thumbsContainer.addEventListener('click', (e) => {
      const thumb = e.target.closest('.pdp-thumb');
      if (!thumb) return;

      thumbsContainer.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');

      const newSrc = thumb.getAttribute('data-image');
      if (newSrc) {
        mainImage.classList.add('image-fade');
        setTimeout(() => {
          mainImage.src = newSrc;
          mainImage.classList.remove('image-fade');
        }, 150);
      }
    });
  }

  // 360 Scrubber / Angle Slider
  if (angleSlider) {
    angleSlider.addEventListener('input', (e) => {
      const thumbs = thumbsContainer ? thumbsContainer.querySelectorAll('.pdp-thumb') : [];
      if (thumbs.length === 0) return;
      const angleIndex = Math.floor((e.target.value / 100) * thumbs.length);
      const safeIndex = Math.min(Math.max(angleIndex, 0), thumbs.length - 1);
      const targetThumb = thumbs[safeIndex];
      if (targetThumb) targetThumb.click();
    });
  }
}
