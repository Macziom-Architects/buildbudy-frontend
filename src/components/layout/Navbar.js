"use client";

import { useState, useSyncExternalStore, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, User, ShoppingCart, Heart, Menu, X, ChevronRight, Truck } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import SearchBar from "@/components/ui/SearchBar";
import { useCart } from "@/context/CartContext";

const LOCATION = { city: "Mumbai", area: "Andheri West", pincode: "400058" };

function LocationPopover({ onClose }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {/* Arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 bg-white border-l border-t border-gray-100 rotate-45" />

      {/* Header */}
      <div className="bg-primary px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-white leading-tight">
              {LOCATION.area}, {LOCATION.city}
            </p>
            <p className="text-[10px] text-white/50">PIN: {LOCATION.pincode}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex items-start gap-2 mb-3">
          <Truck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary">Delivery available to your area</p>
            <p className="text-[11px] text-muted mt-0.5">Orders above ₹999 ship free</p>
          </div>
        </div>
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center justify-between w-full bg-accent text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Manage Addresses
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={onClose}
          className="mt-2 w-full text-center text-[11px] text-muted hover:text-primary transition-colors cursor-pointer"
        >
          Change location
        </button>
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Materials", href: "/materials" },
  { label: "Tools",     href: "/tools" },
  { label: "Hardware",  href: "/hardware" },
  { label: "DIY",       href: "/diy" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef(null);
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const cartCount    = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishCount    = wishlist.length;
  const isLoggedIn = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => !!localStorage.getItem("bb_logged_in"),
    () => false
  );
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      {/* ── Announcement bar ─────────────────────────────────────── */}
      <div className="bg-accent h-8 flex items-center justify-center px-4 overflow-hidden">
        <p className="text-xs font-semibold text-primary tracking-wide whitespace-nowrap">
          <span className="hidden sm:inline">FREE DELIVERY ABOVE ₹999 &nbsp;·&nbsp; TRUSTED BY 10,000+ HOMEOWNERS</span>
          <span className="sm:hidden">FREE SHIPPING ₹999+ &nbsp;·&nbsp; 10K+ CUSTOMERS</span>
        </p>
      </div>

      {/* ── Main navbar ──────────────────────────────────────────── */}
      <div className="bg-primary shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Desktop row */}
          <div className="flex items-center gap-5 h-16">
            {/* Logo + brand text */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image
                src="/logo.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-bold leading-none tracking-tight">
                <span className="text-accent">Build</span>
                <span className="text-white">Budy</span>
              </span>
            </Link>

            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center flex-shrink-0">
              {NAV_LINKS.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-3 py-2 text-sm transition-colors duration-150 ${
                      active
                        ? "text-white font-semibold"
                        : "text-white/60 font-medium hover:text-white"
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Search — desktop */}
            <div className="hidden md:block flex-1 min-w-0">
              <SearchBar
                variant="dark"
                placeholder="Search for professional grade tools..."
                inputClassName="
                  w-full h-[38px] pl-9 pr-4 text-sm rounded-md
                  bg-white/10 border border-white/10
                  text-white placeholder:text-white/40
                  focus:outline-none focus:bg-white focus:text-primary
                  focus:placeholder:text-muted focus:border-accent/50
                  transition-[background-color,color,border-color] duration-200
                "
              />
            </div>

            {/* Auth buttons — desktop */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium bg-accent text-primary rounded-md px-4 py-2 hover:bg-accent/90 transition-colors duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Right icons — desktop */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              {/* Location with hover popover */}
              <div
                ref={locationRef}
                className="relative"
                onMouseEnter={() => setLocationOpen(true)}
                onMouseLeave={() => setLocationOpen(false)}
              >
                <button
                  aria-label="Set location"
                  aria-expanded={locationOpen}
                  onClick={() => setLocationOpen((p) => !p)}
                  className={`p-2 rounded-md transition-colors cursor-pointer ${
                    locationOpen
                      ? "text-accent bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                </button>
                {locationOpen && (
                  <LocationPopover onClose={() => setLocationOpen(false)} />
                )}
              </div>
              <Link
                href="/profile"
                aria-label="Profile"
                className="p-2 text-white/70 rounded-md hover:text-white hover:bg-white/10 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative p-2 text-white/70 rounded-md hover:text-white hover:bg-white/10 transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {wishCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 text-white/70 rounded-md hover:text-white hover:bg-white/10 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="flex md:hidden items-center gap-1 ml-auto">
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 text-white/70 rounded-md hover:bg-white/10 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="p-2 text-white/70 rounded-md hover:bg-white/10 transition-colors"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search — mobile (second row) */}
          <div className="md:hidden pb-3">
            <SearchBar
              variant="dark"
              placeholder="Search for tools..."
              inputClassName="
                w-full h-[38px] pl-9 pr-4 text-sm rounded-md
                bg-white/10 border border-white/10
                text-white placeholder:text-white/40
                focus:outline-none focus:bg-white focus:text-primary
                focus:placeholder:text-muted focus:border-accent/50
                transition-[background-color,color,border-color] duration-200
              "
            />
          </div>
        </div>

        {/* ── Mobile menu panel ──────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <ul className="space-y-0.5">
                {NAV_LINKS.map(({ label, href }) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${
                          active
                            ? "text-accent font-semibold bg-white/5"
                            : "text-white/70 font-medium hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 pt-2 border-t border-white/10 space-y-0.5">
                {/* Location info row for mobile */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{LOCATION.area}, {LOCATION.city}</p>
                    <p className="text-[10px] text-white/40">PIN {LOCATION.pincode} · Free delivery above ₹999</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-[11px] font-bold text-accent hover:text-accent/80 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    Change
                  </Link>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
              </div>
              {!isLoggedIn && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-white/70 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium bg-accent text-primary rounded-md hover:bg-accent/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
