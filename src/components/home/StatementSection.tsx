import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StatementSection() {
  return (
    <section className="py-20 md:py-28 bg-[#090a0d] border-t border-b border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
          WE TURN IDEAS INTO 3D.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          From vehicles and hard-surface models to game-ready 3D models, Moon 3D
          Studio delivers detailed geometry, clean UVs and realistic materials for
          your project.
        </p>
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-[#d4ff00] hover:text-[#bcf000] group"
        >
          <span>LEARN ABOUT US</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
