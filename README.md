PROJECT: BuildBudy (Frontend Only)

OVERVIEW:
BuildBudy is a hybrid platform combining:

1. E-commerce for home improvement products (tools, hardware, appliances)
2. On-demand professional services (plumbing, electrical, painting, etc.)

Goal:
Build a platform similar to Amazon (products) + Urban Company (services).

---

CURRENT STATUS:

We have COMPLETED:

### 1. Landing Page

* Navbar (logo, navigation, search, icons)
* Hero section (CTA + visual)
* Shop by Department (category grid)
* Promo Banner
* Featured Essentials (custom layout)
* Services Section (product + service connection)
* DIY Section (learning content)
* Newsletter section
* Footer

---

### 2. Authentication Flow (Frontend Only)

* Login page (email + password)
* Signup page (name, email, mobile, password)
* OTP verification (mobile/email)
* Forgot password flow (OTP + reset)
* Onboarding flow (post signup)

---

### 3. Product Listing Page (PLP)

* Search-based navigation (/products?q=...)
* Responsive product grid
* Filters (price, rating, availability)
* Sorting (price, rating, popularity)
* Pagination (frontend-based)
* Mobile filter drawer

---

### 4. Product Detail Page (PDP)

* Image gallery (clickable thumbnails)
* Product info (title, rating, price)
* Quantity selector (interactive)
* Add to Cart + Buy Now buttons
* Responsive layout (mobile + desktop)
* Sticky mobile action bar

---

### 5. Cart System (Frontend State)

* Add to Cart functionality (working)
* Quantity update (+ / -)
* Remove item
* Cart page UI (left items + right summary)
* Pricing calculation (subtotal, discount, delivery, total)
* Redirect to cart on add
* Local state using Context API

---

TECH STACK:

* Next.js (App Router)
* JavaScript (NO TypeScript)
* Tailwind CSS
* React Icons / Lucide (mixed usage)
* Context API (cart state)

---

DESIGN SYSTEM:

* Primary: #132028 (dark navy)
* Accent: #F0C12D (yellow)
* Background: #F9FAFB
* Font: Inter

Design Style:

* Clean, minimal, modern
* Card-based UI
* Consumer-focused (not dashboard-like)
* Inspired by Amazon / IKEA UX

---

DATA STATUS:

* Using MOCK DATA (frontend only)
* Backend under development

Defined API contracts for:

* Products
* Categories
* Services
* Featured content
* DIY guides
* Promotions
* Onboarding

---

IMPORTANT RULES:

* Maintain UI consistency
* Do NOT redesign entire pages unnecessarily
* Focus on refinement over reinvention
* Keep responsiveness clean (mobile-first)
* Avoid overengineering (keep it simple)

---

CURRENT LIMITATIONS:

* No backend integration yet
* Cart not persisted across sessions (if localStorage not implemented)
* No real checkout system
* No real recommendations system
* Some UI still needs polish (spacing, hierarchy)

---

NEXT STEPS (PRIORITY ORDER):

1. Cart Improvements

   * Navbar cart badge (live count)
   * Persist cart in localStorage
   * Prevent duplicate items

2. Checkout Flow

   * Address page
   * Payment UI
   * Order confirmation

3. Backend Integration

   * Replace mock data with API
   * Pagination via backend
   * Real search & filters

4. Product Enhancements

   * Related products (smart logic)
   * Reviews system
   * Stock handling

5. Services Flow

   * Service booking UI
   * Scheduling system

---

NOTE FOR AI (Codex / Claude):

* DO NOT modify UI unnecessarily
* Work incrementally (one feature at a time)
* Prefer minimal changes over large rewrites
* Keep components modular
* Always respect existing design system
* Focus on functionality + UX improvements

---
