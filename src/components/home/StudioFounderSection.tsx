import React from "react";
import Image from "next/image";

export default function StudioFounderSection() {
  return (
    <section id="about" aria-label="About the Studio and Founder" className="py-24 md:py-32 bg-[#090a0d] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase text-[#d4ff00] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
          ABOUT MOON 3D STUDIO
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column - Studio Vision & Founder */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-xl bg-[#11141a] border border-white/8">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white mb-5 leading-tight">
                CRAFTING ARTWORK FOR NEXT-GEN PLATFORMS
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal mb-8">
                Moon 3D Studio is a specialized 3D art studio focused on creating
                high-quality vehicles, game-ready assets and environments for games
                and digital experiences.
              </p>
            </div>

            {/* Founder Badge */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/8">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4ff00]/40 shrink-0">
                <Image
                  src="/team/moon-ahmed.jpg"
                  alt="Munna Ahmed — Founder and Lead 3D Artist at Moon 3D Studio"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                  Munna Ahmed
                </h3>
                <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase">
                  Founder / Lead 3D Artist
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Studio Specifications */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-xl bg-[#12151b] border border-white/8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="pb-5 border-b border-white/5">
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                  LOCATION
                </span>
                <span className="text-sm font-semibold text-white tracking-wide">
                  Remote / Worldwide
                </span>
              </div>

              <div className="pb-5 border-b border-white/5">
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                  PRIMARY FOCUS
                </span>
                <span className="text-sm font-semibold text-white tracking-wide">
                  Vehicles & Hard Surface
                </span>
              </div>

              <div className="pb-5 border-b border-white/5">
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                  SUPPORTED ENGINES
                </span>
                <span className="text-sm font-semibold text-white tracking-wide">
                  Unreal Engine 5, Unity
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                  PRODUCTION AVAILABILITY
                </span>
                <div className="inline-flex items-center gap-2 text-sm font-mono font-bold text-[#d4ff00] tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
                  OPEN FOR NEW PROJECTS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
