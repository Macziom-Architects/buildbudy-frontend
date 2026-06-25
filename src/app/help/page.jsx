"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle, Package, Truck, RotateCcw, ShieldCheck,
  Phone, Mail, ChevronDown, ChevronUp, ArrowRight, CheckCircle,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Visit My Profile → My Orders to see real-time status updates on all your orders. You'll also receive SMS/email updates at each stage.",
  },
  {
    q: "What is the return policy?",
    a: "We offer a 30-day hassle-free return policy on all products. Items must be unused and in original packaging. Service bookings are refundable up to 24 hours before the scheduled time.",
  },
  {
    q: "How do I cancel or reschedule a service booking?",
    a: "Go to My Profile → My Orders and select the service booking. You can cancel or reschedule up to 2 hours before the appointment time.",
  },
  {
    q: "Is delivery available in my area?",
    a: "We deliver across most major cities in India. Enter your pincode at checkout to confirm availability. Orders above ₹999 qualify for free delivery.",
  },
  {
    q: "Are the service professionals verified?",
    a: "Yes. All professionals on BuildBudy are background-verified, licensed, and rated by previous customers. We only partner with experienced tradespeople.",
  },
  {
    q: "How do I get an invoice for my order?",
    a: "Invoices are automatically sent to your registered email after order confirmation. You can also download them from My Profile → My Orders.",
  },
];

const TOPICS = [
  { icon: Package,     label: "Orders",   href: "/profile",      desc: "Track, cancel, or return" },
  { icon: Truck,       label: "Delivery", href: "/products",     desc: "Shipping info & estimates" },
  { icon: RotateCcw,   label: "Returns",  href: "/profile",      desc: "Return & refund requests" },
  { icon: ShieldCheck, label: "Services", href: "/services",     desc: "Booking & rescheduling" },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="text-sm font-semibold text-primary">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted flex-shrink-0 ml-3" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted flex-shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-gray-100 bg-gray-50/50 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* Hero */}
      <section className="bg-primary py-12 md:py-16 text-center px-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-3 inline-block">
          Support Center
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          How can we help?
        </h1>
        <p className="text-white/60 text-sm max-w-md mx-auto">
          Find answers to common questions or reach our team — we respond within 2 hours.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Quick topics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {TOPICS.map(({ icon: Icon, label, href, desc }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 text-center group cursor-pointer"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-primary">{label}</p>
              <p className="text-xs text-muted">{desc}</p>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-1">Frequently Asked Questions</h2>
          <p className="text-sm text-muted mb-6">Quick answers to the most common queries</p>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary">Contact Support</h2>
              <p className="text-xs text-muted">We&apos;ll get back to you within 2 hours</p>
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
              <p className="text-base font-bold text-primary mb-1">Message received!</p>
              <p className="text-sm text-muted mb-5">We&apos;ll reply to {form.email} within 2 hours.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white text-sm font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Send Message
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Contact alternatives */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary">Call Us</p>
                <p className="text-xs text-muted">+91 1800 123 4567 (9am – 6pm)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary">Email</p>
                <p className="text-xs text-muted">support@buildbudy.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
