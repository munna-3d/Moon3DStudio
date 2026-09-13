import React from "react";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { Box, Gamepad2, Car, Shield, Sparkles, Layers, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const iconMap: Record<string, React.ReactNode> = {
    box: <Box className="w-5 h-5 text-[#d4ff00]" />,
    gamepad: <Gamepad2 className="w-5 h-5 text-[#d4ff00]" />,
    car: <Car className="w-5 h-5 text-[#d4ff00]" />,
    shield: <Shield className="w-5 h-5 text-[#d4ff00]" />,
    sparkles: <Sparkles className="w-5 h-5 text-[#d4ff00]" />,
    layers: <Layers className="w-5 h-5 text-[#d4ff00]" />,
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-[#0b0d12] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-2">
            WHAT WE CAN CREATE FOR YOU
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Comprehensive 3D asset production services.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group p-7 rounded-xl bg-[#12151b] border border-white/8 hover:border-[#d4ff00]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#d4ff00]/30 transition-all">
                  {iconMap[service.iconName]}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  {service.shortDesc}
                </p>
              </div>

              {/* Action Link */}
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-zinc-400 group-hover:text-[#d4ff00] transition-colors"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
