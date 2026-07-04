"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, Tags, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { getProfile } from "@/lib/api/auth";

const NAV = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

/**
 * Admin shell — gates every /admin page on the `admin` role from /auth/me.
 * Not linked from the storefront nav; admins go to /admin directly.
 */
export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("checking"); // checking | ok | denied

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("bb_logged_in")) {
      router.replace("/auth/login");
      return;
    }
    getProfile()
      .then((u) => setStatus(u?.roles?.includes("admin") ? "ok" : "denied"))
      .catch(() => setStatus("denied"));
  }, [router]);

  if (status === "checking") {
    return (
      <main className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <ShieldAlert className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-primary">Admin access required</p>
          <p className="text-xs text-muted mt-1 mb-4">This account doesn&apos;t have the admin role.</p>
          <Link href="/" className="text-sm font-semibold text-accent hover:underline">← Back to store</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-[#0F1E25] text-white flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <p className="text-sm font-bold"><span className="text-accent">Build</span>Budy</p>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-accent text-primary"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-4 text-xs text-white/40 hover:text-white border-t border-white/10 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to store
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 p-6">{children}</main>
    </div>
  );
}
