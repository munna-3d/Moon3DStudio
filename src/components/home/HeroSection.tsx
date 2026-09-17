import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";

interface HeroSectionProps {
  featuredProject?: Project;
}

export default function HeroSection({ featuredProject }: HeroSectionProps) {
  const heroImage = featuredProject?.heroImage || "/hero/hexa-bison-hero.webp";
  const heroTitle = featuredProject?.title || "HEXA BISON VX-2.0";
  const heroCategory = featuredProject?.categoryLabel || "VEHICLE";
  const isVideo =
    heroImage.endsWith(".mp4") ||
    heroImage.endsWith(".webm") ||
    heroImage.endsWith(".mov") ||
    heroImage.endsWith(".ogg");

  return (
    <section aria-label="Hero Section" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#090a0d] via-[#0b0d12] to-[#090a0d]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#d4ff00]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Header */}
        <div className="max-w-4xl">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[1.08] mb-6">
            WE CREATE 3D ASSETS FOR <br className="hidden sm:inline" />
            GAMES & DIGITAL EXPERIENCES.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal max-w-2xl leading-relaxed mb-8">
            Professional 3D modeling, texturing and game-ready asset production for
            studios, developers and creative teams.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#work"
              className="px-6 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-all"
            >
              SEE OUR WORK
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded bg-[#d4ff00] text-black hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all transform active:scale-95"
            >
              START A PROJECT
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Hero Artwork Showcase */}
        <div className="mt-12 sm:mt-16 relative group">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-[#12151b] shadow-2xl">
            {isVideo ? (
              <video
                src={heroImage}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroImage}
                alt={`${heroTitle} — high-performance game-ready 3D ${heroCategory.toLowerCase()} model created by Moon 3D Studio`}
                fill
                priority
                className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
