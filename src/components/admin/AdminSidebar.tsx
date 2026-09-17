"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Sparkles,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Enquiries", href: "/admin/enquiries", icon: Inbox },
    { name: "Projects CMS", href: "/admin/projects", icon: FolderKanban },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Services CMS", href: "/admin/services", icon: Sparkles },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#11141a] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00]" />
          <span className="font-display font-bold text-sm tracking-wider text-white">
            MOON 3D ADMIN
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-zinc-400 hover:text-white rounded bg-white/5"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#11141a] border-r border-white/8 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_8px_#d4ff00]" />
              <div>
                <div className="font-display font-bold text-sm tracking-wider text-white">
                  MOON 3D STUDIO
                </div>
                <div className="text-[10px] font-mono text-[#d4ff00] tracking-widest uppercase">
                  MANAGEMENT PORTAL
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#d4ff00] text-black shadow-[0_0_15px_rgba(212,255,0,0.25)] font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {/* Live site link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded text-xs text-zinc-400 hover:text-[#d4ff00] hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </span>
            <span className="text-[10px] font-mono">↗</span>
          </Link>

          {/* User Badge */}
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] font-mono text-zinc-400 truncate">{user.email}</div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[9px] font-mono font-bold text-[#d4ff00]">
              {user.role}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT
          </button>
        </div>
      </aside>
    </>
  );
}
