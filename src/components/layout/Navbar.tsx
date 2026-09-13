"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "WORK", href: isHome ? "#work" : "/work" },
    { name: "SERVICES", href: isHome ? "#services" : "/services" },
    { name: "ABOUT", href: isHome ? "#about" : "/studio" },
    { name: "CONTACT", href: isHome ? "#contact" : "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090a0d]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_10px_#d4ff00] group-hover:scale-125 transition-transform" />
          <span className="font-display font-bold text-lg tracking-wider text-white group-hover:text-[#d4ff00] transition-colors">
            MOON 3D STUDIO
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = !isHome && pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold tracking-widest transition-colors ${
                  isActive
                    ? "text-[#d4ff00]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider uppercase rounded bg-[#d4ff00] text-black hover:bg-[#bcf000] hover:shadow-[0_0_18px_rgba(212,255,0,0.4)] transition-all transform active:scale-95"
          >
            START A PROJECT
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#090a0d]/98 border-b border-white/10 px-6 py-8 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold tracking-widest text-zinc-200 hover:text-[#d4ff00] transition-colors py-1 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold tracking-widest uppercase rounded bg-[#d4ff00] text-black hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all"
            >
              START A PROJECT
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
