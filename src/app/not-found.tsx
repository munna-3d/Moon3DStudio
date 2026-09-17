import React from "react";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090a0d] flex items-center justify-center px-4 py-32 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 mx-auto rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
          <Box className="w-8 h-8 text-[#d4ff00]" aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#d4ff00] uppercase block mb-2">
            ERROR 404
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-3">
            PAGE NOT FOUND
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
            The 3D model, page or coordinate you were looking for does not exist or has been relocated to another directory.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO HOME
          </Link>
          <Link
            href="/work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-colors"
          >
            EXPLORE WORK
          </Link>
        </div>
      </div>
    </div>
  );
}
