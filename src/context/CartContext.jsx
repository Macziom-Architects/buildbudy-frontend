"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import * as cartApi from "@/lib/api/cart";

const CartContext = createContext(null);

function isLoggedIn() {
  try {
    return typeof window !== "undefined" && !!localStorage.getItem("bb_logged_in");
  } catch {
    return false;
  }
}

/**
 * Normalise the backend CartItem into the shape the UI already consumes
 * ({ id, name, price, image, quantity, ... }), while keeping the backend
 * identifiers around. `id` is the supplierProductId — the key the cart API
 * uses for update/remove — so existing callers of updateQuantity(id)/
 * removeFromCart(id) keep working unchanged.
 */
function normalize(items) {
  return (items || []).map((it) => ({
    id: it.supplierProductId,
    supplierProductId: it.supplierProductId,
    productId: it.productId,
    name: it.productName,
    slug: it.productSlug,
    price: (it.pricePaise ?? 0) / 100,
    image: it.primaryImageUrl || null,
    quantity: it.quantity,
    availableStock: it.availableStock,
    minOrderQuantity: it.minOrderQuantity,
    supplierName: it.supplierName,
    category: it.supplierName || "",
  }));
}

function CartToast({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-[72px] right-4 z-[200] flex flex-col gap-2 pointer-events-none md:top-20">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-xl text-sm font-semibold
            pointer-events-auto max-w-[260px] sm:max-w-[320px]
            animate-[slideInRight_0.25s_ease-out]
            ${toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-primary text-white"
            }`}
        >
          {toast.type === "error"
            ? <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-200" />
            : <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
          }
          <span className="flex-1 leading-tight truncate">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function CartProvider({ children }) {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Load the cart from the server when logged in; empty it when logged out.
  // The cart itself lives in Redis per-user, so logout just clears local state —
  // the server cart is restored on next login.
  const refreshCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const items = await cartApi.getCart();
      setCartItems(normalize(items));
    } catch {
      // leave the current items in place on a transient failure
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + react to login/logout (both dispatch a "storage" event).
  // The initial fetch is deferred so it doesn't set state synchronously during
  // the effect (avoids cascading renders).
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) refreshCart(); });
    window.addEventListener("storage", refreshCart);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", refreshCart);
    };
  }, [refreshCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isLoggedIn()) {
      showToast("Please log in to add items to your cart", "error");
      router.push("/auth/login");
      return;
    }
    const supplierProductId = product?.supplierProductId;
    if (!supplierProductId) {
      // Mock catalog products don't carry a supplier listing id yet — this works
      // once products are served from the DB.
      showToast("This product isn't available for ordering yet", "error");
      return;
    }
    try {
      const items = await cartApi.addToCart(supplierProductId, Math.max(1, Number(quantity) || 1));
      setCartItems(normalize(items));
      showToast("Added to cart");
    } catch (err) {
      showToast(err?.message || "Could not add to cart", "error");
    }
  }, [router, showToast]);

  const removeFromCart = useCallback(async (supplierProductId) => {
    try {
      const items = await cartApi.removeFromCart(supplierProductId);
      setCartItems(normalize(items));
    } catch (err) {
      showToast(err?.message || "Could not remove item", "error");
    }
  }, [showToast]);

  const updateQuantity = useCallback(async (supplierProductId, quantity) => {
    const qty = Math.max(0, Number(quantity) || 0);
    try {
      const items = qty === 0
        ? await cartApi.removeFromCart(supplierProductId)
        : await cartApi.updateCartItem(supplierProductId, qty);
      setCartItems(normalize(items));
    } catch (err) {
      showToast(err?.message || "Could not update quantity", "error");
    }
  }, [showToast]);

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clearCart();
      setCartItems([]);
    } catch (err) {
      showToast(err?.message || "Could not clear cart", "error");
    }
  }, [showToast]);

  const value = useMemo(
    () => ({ cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart, showToast, refreshCart }),
    [cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart, showToast, refreshCart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartToast toasts={toasts} onDismiss={dismissToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
