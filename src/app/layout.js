

"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth") || pathname === "/onboarding";

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col bg-background text-primary font-sans relative">
        <CartProvider>
        {/* Navbar only for normal pages */}
        {!isAuthPage && <Navbar />}

        {/* 🔝 Logo (only for auth + onboarding) */}
        {isAuthPage && (
          <Link
            href="/"
            className="absolute top-5 left-5 z-10 flex items-center gap-2 hidden md:flex"
          >
            <Image src="/logo.svg" alt="logo" width={28} height={28} />
            <span className="text-lg font-bold text-primary">
              <span className="text-accent">Build</span>Budy
            </span>
          </Link>
        )}

        {isAuthPage && (
          <div className="absolute top-0 right-0 w-50 h-50 bg-accent opacity-60 rounded-bl-full z-0 hidden md:block" />
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col">{children}</div>
        {!isAuthPage && <MobileNavbar />}
        </CartProvider>

        {/* ⬛ Bottom Bar (only for auth + onboarding) */}
        {isAuthPage && (
          <div className="absolute bottom-0 left-0 w-full h-20 bg-[#1E293B] hidden md:block" />
        )}
      </body>
    </html>
  );
}
