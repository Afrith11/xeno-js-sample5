# ATELIER 404 — FASHION BEYOND FORM
## Sample Website 05 | Experimental Digital Luxury & Avant-Garde E-Commerce

---

### Brand Overview
**ATELIER 404** is an independent international digital luxury fashion house operating at the bleeding-edge intersection of avant-garde fashion magazines, futuristic design studios, and computational garment prototyping.

- **Tagline**: `FASHION BEYOND FORM.`
- **Brand Personality**: Experimental, Futuristic, Artistic, Unconventional, Confident, Avant-garde, Digitally native.
- **Color System**:
  - Primary Electric Lime: `#D7FF00`
  - Cobalt Blue: `#2448FF`
  - Graphite & Deep Onyx: `#171717` & `#0D0D0D`
  - Off-White: `#F3F1EB`
  - Metallic Silver: `#BFC3C7`
  - Accent Orange: `#FF5429`

---

### Architecture & Tech Stack
- **HTML5**: Semantic tags, accessible attributes, and responsive layout structure.
- **CSS3**: Custom properties, Fluid Typography with `clamp()`, CSS Grid, Flexbox, and zero frameworks.
- **Vanilla JavaScript (ES6+)**: Reusable modules, zero dependencies, Web Audio API micro-synth sound simulation.
- **Persistence**: `localStorage` shopping cart & wishlist persistence.
- **Deployment**: 100% static, ready for instant Vercel deployment.

---

### Project File Structure
```
atelier-404/
├── index.html              # Experimental Digital Fashion Homepage
├── shop.html               # Shop All Objects (Filtering, Sorting, Grid/Asymmetric Switcher)
├── new-drops.html          # Capsule 026 Limited Edition Drops & Countdown
├── product.html            # Dynamic Product Details (Multi-angle zoom, 360 scrubber, specs)
├── collections.html        # Curated Collections Directory
├── collection.html         # Kinetic Monolith Fall/Winter 2026 Editorial Lookbook
├── journal.html            # The Design Journal (Critical fashion essays & theory)
├── about.html              # Atelier Manifesto, Material Alchemy & Global Labs
├── contact.html            # VIP Client Concierge & Bespoke Commissions
├── cart.html               # Persistent Shopping Bag & Checkout Simulator
├── assets/
│   ├── css/
│   │   ├── style.css       # Core design tokens, typography, and component styling
│   │   └── responsive.css  # Full responsive system across 8 target breakpoints
│   ├── js/
│   │   ├── products.js     # Master archive of 14 fictional avant-garde products with INR prices
│   │   ├── cart.js         # Persistent localStorage cart and wishlist engine
│   │   ├── navigation.js   # Left floating rail, right utility controls, drawers & mobile overlay
│   │   ├── gallery.js      # Horizontal object exhibition and product multi-angle viewer
│   │   ├── interactions.js # Custom magnetic cursor, 404 interactive experiment & quick view
│   │   └── main.js         # Core application bootstrap, filter/sort routines, and checkout simulator
│   └── images/             # Image directory
└── README.md
```

---

### Key Features
1. **Desktop Left Floating Navigation Rail**: Compact 72px rail expandable to 280px on hover/click, active indicators, and Web Audio API synthesizer toggle.
2. **Right Floating Utility Panel**: Instant keyboard-driven search (`/`), slide-out Wishlist drawer, and Shopping Bag with live badge updates.
3. **Top Live Status Beacon**: `● ATELIER ONLINE / COLLECTION 2026 // UTC [LIVE CLOCK]`.
4. **Mobile Navigation Overlay**: Fullscreen kinetic typography menu with background scroll locking and ESC support.
5. **Horizontally Scrolling Object Gallery**: High-performance drag-and-scroll carousel on homepage with non-trapping vertical scroll behavior.
6. **The 404 Experiment**: Interactive spatial installation with pointer-reactive parallax, live coordinates, and X-Ray wireframe mode.
7. **The Drop Room**: Asymmetric modular grid with hero spotlight tiles and instant acquisition actions.
8. **E-Commerce Features**:
   - 14 unique avant-garde products with realistic INR pricing.
   - Size and colorway selectors with real-time stock alerts.
   - Dynamic quantity stepper and subtotal calculations.
   - Promo coupon engine (`ATELIER10` for 10% off, `FUTURE404` for complimentary courier).
   - Complete checkout simulator with order ID generation and invoice summary.
   - Wishlist toggle and quick transfer to cart.
   - Quick View modal for previewing without navigating away.
9. **Desktop Custom Cursor**: Smooth Lerp magnetic pointer with expand/drag states and coarse-pointer fallback for touch devices.

---

### Local Testing & Deployment
To run locally:
```powershell
python -m http.server 8000
```
Open `http://localhost:8000` in any modern web browser.
Deploy directly to Vercel by pushing to a Git repository or using `vercel deploy`.
