"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Is this product covered under warranty?",
    a: "Yes. All products on BuildBudy include a minimum 6-month manufacturer warranty. Extended warranty options may be available at checkout.",
  },
  {
    q: "Can I return this if it doesn't meet my expectations?",
    a: "Absolutely. We offer a 30-day hassle-free return policy on all products. Items must be unused and in original packaging.",
  },
  {
    q: "How long will delivery take?",
    a: "Most orders are delivered within 2–5 business days. Express delivery (1–2 days) is available at select pincodes — check availability using the pincode checker above.",
  },
  {
    q: "Is the product suitable for professional use?",
    a: "Yes. Our catalog is curated for both professional contractors and serious home renovators. Each product listing includes specifications to help match it to your project needs.",
  },
  {
    q: "How do I track my order after purchase?",
    a: "Once your order is placed, you'll receive email and SMS updates at every stage. You can also track your order live from My Profile → My Orders.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left cursor-pointer group"
      >
        <span className="text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
          {q}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted" />
          : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted" />}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-6 text-gray-500">{a}</p>
      )}
    </div>
  );
}

export default function ProductFAQ() {
  return (
    <section className="mt-10 md:mt-14">
      <h2 className="mb-1 text-lg font-bold text-primary">Frequently Asked Questions</h2>
      <p className="mb-5 text-sm text-muted">Common questions about this product</p>
      <div className="rounded-2xl border border-gray-100 bg-white px-6 shadow-sm">
        {FAQS.map((item) => (
          <FAQItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
}
