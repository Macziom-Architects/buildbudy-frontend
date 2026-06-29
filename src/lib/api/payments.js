import { apiPost } from "./client";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Lazy-loads the Razorpay Checkout script and resolves once `window.Razorpay`
 * is available. Safe to call multiple times.
 */
export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.Razorpay) return resolve(window.Razorpay);

    let script = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (script) {
      script.addEventListener("load", () => resolve(window.Razorpay));
      script.addEventListener("error", () => reject(new Error("Razorpay SDK failed to load")));
      return;
    }
    script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });
}

/**
 * POST /payments/verify — hands the Razorpay checkout-handler response back to the
 * backend, which verifies the HMAC signature and confirms the order. No webhook needed.
 * Returns { orderId, orderNumber, status }.
 */
export function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  return apiPost("/payments/verify", { razorpayOrderId, razorpayPaymentId, razorpaySignature });
}
