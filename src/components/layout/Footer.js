import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
// ─── Data ─────────────────────────────────────────────────────────────────────

const LINK_GROUPS = [
  {
    heading: "Shop",
    links: [
      { label: "All Products",  href: "/products" },
      { label: "Materials",     href: "/materials" },
      { label: "Tools",         href: "/tools" },
      { label: "Hardware",      href: "/hardware" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help & FAQ",      href: "/help" },
      { label: "Order Tracking",  href: "/profile" },
      { label: "Book a Service",  href: "/services/book" },
      { label: "DIY Guides",      href: "/diy" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "My Profile",   href: "/profile" },
      { label: "My Orders",    href: "/profile" },
      { label: "Addresses",    href: "/profile" },
      { label: "Sign Up",      href: "/auth/signup" },
    ],
  },
];

const SOCIALS = [
  { icon: FaYoutube,  href: "#", label: "YouTube"   },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn"  },
  { icon: FaGithub,   href: "#", label: "GitHub"    },
];

// ─── Link group ───────────────────────────────────────────────────────────────

function LinkGroup({ heading, links }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">
        {heading}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-white/10">
      <div className="px-4 sm:px-6 lg:px-16 py-16">

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">

            {/* Logo + wordmark */}
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="relative w-7 h-7 flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="BuildBudy logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold leading-none">
                <span className="text-accent">Build</span>
                <span className="text-white">Budy</span>
              </span>
            </Link>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The ultimate source for high-performance tools and industrial supplies. Engineered for precision and built for long-term reliability.
            </p>
          </div>

          {/* Columns 2–4 — Link groups */}
          {LINK_GROUPS.map((group) => (
            <LinkGroup key={group.heading} {...group} />
          ))}

        </div>

        {/* ── Bottom row ─────────────────────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-xs text-white/35 order-2 sm:order-1">
            © 2026 BuildBudy. Engineered for Precision.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4 order-1 sm:order-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-500 hover:text-white transition-colors duration-150"
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}
