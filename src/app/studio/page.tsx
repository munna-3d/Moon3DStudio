import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layers, ShieldCheck, Target } from "lucide-react";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Moon 3D Studio | 3D Game Art Studio",
  description:
    "Learn about Moon 3D Studio, a specialized 3D art studio creating professional game-ready assets and visual content for games and digital experiences.",
  alternates: {
    canonical: `${SITE_URL}/studio`,
  },
  openGraph: {
    title: "About Moon 3D Studio | 3D Game Art Studio",
    description:
      "Learn about Moon 3D Studio, a specialized 3D art studio creating professional game-ready assets and visual content for games and digital experiences.",
    url: `${SITE_URL}/studio`,
    siteName: "Moon 3D Studio",
    images: [
      {
        url: "/team/moon-ahmed.jpg",
        width: 800,
        height: 800,
        alt: "Munna Ahmed — Founder & Lead 3D Artist at Moon 3D Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Moon 3D Studio | 3D Game Art Studio",
    description:
      "Learn about Moon 3D Studio, a specialized 3D art studio creating professional game-ready assets and visual content for games and digital experiences.",
    images: ["/team/moon-ahmed.jpg"],
  },
};

export default function StudioPage() {
  const tools = [
    { name: "Unreal Engine 5", category: "Engine", desc: "Nanite, Lumen & Virtual Shadows ready" },
    { name: "Unity", category: "Engine", desc: "HDRP & URP asset preparation" },
    { name: "Blender", category: "DCC", desc: "Precision modeling & UV unwrapping" },
    { name: "ZBrush", category: "High Poly", desc: "Organic surface detailing & concept sculpting" },
    { name: "Substance 3D Painter", category: "Texturing", desc: "4K/8K PBR metallic/roughness workflows" },
    { name: "Marmoset Toolbag", category: "Baking", desc: "High-accuracy normal & curvature baking" },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Studio", url: "/studio" },
  ]);

  return (
    <div className="pt-32 pb-24 bg-[#090a0d] min-h-screen text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase text-[#d4ff00] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
            STUDIO PROFILE
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            CRAFTED FOR NEXT-GEN EXPERIENCES
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            Moon 3D Studio is a dedicated 3D production unit. We collaborate with independent
            developers, creative agencies, and gaming studios worldwide to produce benchmark-grade 3D assets.
          </p>
        </header>

        {/* Founder & Studio Split Card */}
        <section aria-label="Studio Founder and Overview" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-2xl bg-[#11141a] border border-white/8 mb-20">
          <div className="lg:col-span-5">
            <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <Image
                src="/team/moon-ahmed.jpg"
                alt="Munna Ahmed — Founder and Lead 3D Hard-Surface & Vehicle Artist at Moon 3D Studio"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#d4ff00] block mb-1">
                  STUDIO FOUNDER
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  Munna Ahmed
                </h3>
                <p className="text-xs text-zinc-300">
                  Lead 3D Hard-Surface & Vehicle Artist
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-white">
              PRECISION OVER VOLUME.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
              We operate as an agile, specialized studio rather than an oversized outsourcing factory. This means you work directly with seasoned artists who understand UV optimization, draw-call budgets, and surface aesthetics firsthand.
            </p>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
              Every model delivered by Moon 3D Studio undergoes thorough quality inspection: flawless shading angles, clean non-overlapping UV islands, accurate PBR response under multiple lighting environments, and verified game engine import.
            </p>

            {/* Availability Spec */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">AVAILABILITY</span>
                <span className="text-xs font-mono font-bold text-[#d4ff00] uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
                  OPEN FOR NEW COMMISSIONS
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">LOCATION</span>
                <span className="text-xs font-mono text-zinc-300">Remote / Worldwide</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values */}
        <section aria-label="Core Studio Principles" className="mb-20">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-white mb-8">
            STUDIO CORE PRINCIPLES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#11141a] border border-white/8 space-y-3">
              <Target className="w-6 h-6 text-[#d4ff00]" aria-hidden="true" />
              <h3 className="font-display font-bold text-base uppercase text-white">
                UNCOMPROMISED TOPOLOGY
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                No bad bevels or distorted normal bakes. Geometry is constructed cleanly to ensure deformation stability and smooth LOD step-downs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#11141a] border border-white/8 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#d4ff00]" aria-hidden="true" />
              <h3 className="font-display font-bold text-base uppercase text-white">
                ENGINE-VERIFIED
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Assets are imported and tested inside Unreal Engine 5 or Unity before final handoff, guaranteeing correct pivots, materials, and scale.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#11141a] border border-white/8 space-y-3">
              <Layers className="w-6 h-6 text-[#d4ff00]" aria-hidden="true" />
              <h3 className="font-display font-bold text-base uppercase text-white">
                TRANSPARENT PIPELINE
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Direct milestone communication, weekly progress WIP renders, and structured review rounds so you retain complete control over your assets.
              </p>
            </div>
          </div>
        </section>

        {/* Tools & Pipeline */}
        <section aria-label="Supported Tools and Game Engines" className="mb-20">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-white mb-8">
            SUPPORTED TOOLS & ENGINES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => (
              <div
                key={t.name}
                className="p-4 rounded-lg bg-[#11141a] border border-white/5 flex items-start gap-3"
              >
                <Cpu className="w-5 h-5 text-[#d4ff00] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase">{t.name}</h3>
                  <div className="text-[10px] font-mono text-zinc-400">{t.category}</div>
                  <p className="text-xs text-zinc-400 mt-1 font-normal">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section aria-label="Project Call to Action" className="p-8 md:p-12 rounded-2xl bg-[#11141a] border border-white/10 text-center max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase mb-3">
            READY TO COLLABORATE?
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6 font-normal">
            Share your reference art or design brief and let&apos;s build next-generation 3D assets for your world.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all"
          >
            START A PROJECT
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </section>
      </div>
    </div>
  );
}
