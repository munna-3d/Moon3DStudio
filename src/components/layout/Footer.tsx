import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07080a] text-zinc-400">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Tier */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_8px_#d4ff00]" />
              <span className="font-display font-bold text-base tracking-wider text-white">
                MOON 3D STUDIO — 3D ART & GAME ASSETS
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              High-end asset creation for games, real-time and digital experiences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold tracking-widest">
            <Link href="/work" className="hover:text-white transition-colors">
              WORK
            </Link>
            <Link href="/services" className="hover:text-white transition-colors">
              SERVICES
            </Link>
            <Link href="/studio" className="hover:text-white transition-colors">
              ABOUT
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              CONTACT
            </Link>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Moon 3D Studio. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.artstation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4ff00] transition-colors"
            >
              ArtStation
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4ff00] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4ff00] transition-colors"
            >
              Instagram
            </a>
            <a
              href="mailto:contact@moon3dstudio.com"
              className="hover:text-[#d4ff00] transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
