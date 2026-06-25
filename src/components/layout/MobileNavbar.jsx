"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { FiShoppingCart, FiUser, FiHeart } from "react-icons/fi";
import { MdHomeRepairService } from "react-icons/md";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";

function getUnreadCount() {
  try {
    const raw = typeof window !== "undefined" && localStorage.getItem("bb_notifications");
    if (!raw) return 5; // default seed unread
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((n) => !n.read).length : 0;
  } catch {
    return 0;
  }
}

export default function MobileNavbar() {
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlist }  = useWishlist();
  const cartCount  = cartItems.reduce((s, i) => s + i.quantity, 0);
  const wishCount  = wishlist.length;

  const [notifCount, setNotifCount] = useState(0);
  useEffect(() => {
    setNotifCount(getUnreadCount());
    const handler = () => setNotifCount(getUnreadCount());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const tabs = [
    { label: "Home",     icon: AiFillHome,          route: "/" },
    { label: "Wishlist", icon: FiHeart,              route: "/wishlist",  badge: wishCount },
    { label: "Services", icon: MdHomeRepairService,  route: "/services",  emphasized: true },
    { label: "Cart",     icon: FiShoppingCart,       route: "/cart",      badge: cartCount },
    { label: "Account",  icon: FiUser,               route: "/profile",   badge: notifCount },
  ];

  const isActive = (route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route);

  return (
    <>
      {/* Spacer so page content doesn't hide behind the fixed bar */}
      <div className="md:hidden" style={{ height: "calc(4rem + env(safe-area-inset-bottom, 0px))" }} aria-hidden="true" />

      <nav
        className="fixed bottom-0 left-0 w-full md:hidden bg-[#132028] shadow-[0_-4px_20px_rgba(0,0,0,0.25)] rounded-t-2xl flex justify-between z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map((tab, idx) => {
          const active = isActive(tab.route);
          const Icon   = tab.icon;
          return (
            <Link
              key={idx}
              href={tab.route}
              className="flex flex-col items-center justify-center flex-1 py-3 min-h-[56px] transition-colors active:opacity-70"
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon
                  size={tab.emphasized ? 26 : 22}
                  className={`transition-all duration-200 ${
                    active ? "text-[#F0C12D]" : "text-gray-400"
                  } ${tab.emphasized ? "scale-110 drop-shadow-sm" : ""}`}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-h-4 min-w-4 px-1 bg-accent text-primary text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${active ? "text-[#F0C12D]" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
