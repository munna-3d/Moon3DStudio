import React from "react";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { Box, Gamepad2, Car, Shield, Sparkles, Layers, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Moon 3D Studio",
  description:
    "Explore our professional 3D asset creation services: vehicle modeling, hard surface, game-ready assets, PBR texturing, and environments.",
};

export default function ServicesPage() {
  const iconMap: Record<string, React.ReactNode> = {
    box: <Box className="w-6 h-6 text-[#d4ff00]" />,
    gamepad: <Gamepad2 className="w-6 h-6 text-[#d4ff00]" />,
    car: <Car className="w-6 h-6 text-[#d4ff00]" />,
    shield: <Shield className="w-6 h-6 text-[#d4ff00]" />,
    sparkles: <Sparkles className="w-6 h-6 text-[#d4ff00]" />,
    layers: <Layers className="w-6 h-6 text-[#d4ff00]" />,
  };

  return (
    <div className="pt-32 pb-24 bg-[#090a0d] min-h-screen text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase text-[#d4ff00] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
            WHAT WE DO
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            SERVICES & PRODUCTION PIPELINE
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed">
            From initial silhouette concepts to engine-ready hero props, we produce
            high-fidelity 3D assets that meet your exact artistic vision and technical benchmarks.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-8 mb-20">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="p-8 md:p-10 rounded-2xl bg-[#11141a] border border-white/8 hover:border-[#d4ff00]/40 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Col: Number, Icon, Title, Description */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0">
                      {iconMap[service.iconName]}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        SERVICE 0{index + 1}
                      </span>
                      <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
                        {service.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {service.fullDesc}
                  </p>
                </div>

                {/* Right Col: Capabilities & Deliverables */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400 mb-3">
                      CAPABILITIES
                    </h3>
                    <ul className="space-y-2">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400 mb-3">
                      DELIVERABLES
                    </h3>
                    <ul className="space-y-2">
                      {service.deliverables.map((del) => (
                        <li key={del} className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="p-8 md:p-12 rounded-2xl bg-[#11141a] border border-white/10 text-center max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase mb-3">
            HAVE CUSTOM PRODUCTION REQUIREMENTS?
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6">
            Whether you need a full vehicle fleet or modular level kits, let&apos;s discuss your polygon budgets, deadlines, and technical specifications.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all"
          >
            START A PROJECT INQUIRY
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
