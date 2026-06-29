"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { checkoutCart } from "@/lib/api/cart";
import { loadRazorpay, verifyPayment } from "@/lib/api/payments";

function formatPrice(p) {
  return `₹${(p ?? 0).toLocaleString("en-IN")}`;
}

const STEPS = [
  { num: "01", label: "Shipping" },
  { num: "02", label: "Review & Pay" },
];

export default function ReviewPage() {
  const router = useRouter();
  const { cartItems, refreshCart } = useCart();
  const [address, setAddress] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = typeof window !== "undefined" && sessionStorage.getItem("bb_checkout_addr");
    if (!raw) { router.replace("/checkout/address"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate selected address from sessionStorage on mount
    setAddress(JSON.parse(raw));
  }, [router]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  async function handlePlaceOrder() {
    if (!address) return;
    setPlacing(true);
    setError("");
    try {
      const order = await checkoutCart(address.id);
      // Backend clears the cart as part of checkout; reflect that in the UI.
      refreshCart();

      const Razorpay = await loadRazorpay();
      const rzp = new Razorpay({
        key: order.razorpayKeyId,
        order_id: order.razorpayOrderId,
        amount: order.totalPaise,
        currency: "INR",
        name: "BuildBudy",
        description: `Order ${order.orderNumber}`,
        theme: { color: "#0F1E25" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            sessionStorage.removeItem("bb_checkout_addr");
            router.push(`/order/success?orderId=${order.orderId}`);
          } catch {
            setError(`Payment went through but we couldn't confirm it. Contact support with order ${order.orderNumber}.`);
            setPlacing(false);
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed or was cancelled. You can try again.");
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err?.message || "Couldn't start checkout. Please try again.");
      setPlacing(false);
    }
  }

  if (!address) return null;

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-8">

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${idx === 1 ? "bg-primary text-white" : "text-gray-400"}`}>
                <span className={`text-xs font-bold ${idx === 1 ? "text-accent" : "text-gray-500"}`}>{step.num}</span>
                <span className={`text-xs font-semibold ${idx === 1 ? "text-white" : "text-gray-400"}`}>{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && <span className="mx-1 text-gray-300 text-xs">›</span>}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Review &amp; Pay</h1>
        <p className="text-sm text-muted mt-0.5">Confirm your order, then pay securely with Razorpay.</p>

        <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          {/* LEFT */}
          <div className="space-y-4">

            {/* Delivery address */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-sm text-primary uppercase tracking-wide">Delivery Address</h2>
                <button onClick={() => router.push("/checkout/address")} className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                  Change
                </button>
              </div>
              <p className="text-sm font-semibold text-primary">{address.label}</p>
              <p className="text-sm text-muted mt-0.5">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
              <p className="text-sm text-muted">{address.city}, {address.state} — {address.pincode}</p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="font-bold text-sm text-primary uppercase tracking-wide mb-3">Order Items ({cartItems.length})</h2>
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">Your cart is empty.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center py-3 first:pt-0 last:pb-0">
                      <div className="min-w-[80px] h-20 shrink-0 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                        {item.image && (
                          <Image src={item.image} alt={item.name} width={64} height={64} className="object-contain" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-xs text-muted mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary shrink-0 whitespace-nowrap pl-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — summary + CTA */}
          <div className="space-y-4">
            <div className="bg-[#0F1E25] text-white p-5 rounded-lg shadow-md">
              <h2 className="font-bold text-base tracking-wide uppercase border-b border-white/10 pb-3">Order Summary</h2>
              <div className="mt-3 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">GST &amp; total</span>
                  <span className="text-gray-300 text-xs">calculated at payment</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center font-bold text-base">
                  <span>Payable</span>
                  <span className="text-accent text-lg">{formatPrice(subtotal)}+</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 space-y-1.5">
                <p>✔ Secure Razorpay payment</p>
                <p>✔ GST invoice included</p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-xs font-medium text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing || cartItems.length === 0}
              className="w-full bg-accent text-primary font-bold py-2.5 rounded hover:opacity-80 active:scale-[0.98] cursor-pointer transition-all text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {placing && <Loader2 className="h-4 w-4 animate-spin" />}
              {placing ? "PROCESSING…" : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
