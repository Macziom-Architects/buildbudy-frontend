"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ShoppingCart, CheckCircle, AlertCircle, X } from "lucide-react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "buildbudy_cart";

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
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

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

  const addToCart = useCallback((product, quantity = 1) => {
    const itemQuantity = Math.max(1, Number(quantity) || 1);
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + itemQuantity }
            : item,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: itemQuantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id, quantity) => {
      const qty = Math.max(0, Number(quantity) || 0);
      if (qty === 0) { removeFromCart(id); return; }
      setCartItems((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, showToast }),
    [addToCart, cartItems, removeFromCart, updateQuantity, clearCart, showToast],
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
