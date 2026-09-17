import React from "react";
import { CheckCircle2, MessageSquare, Sliders, Clock } from "lucide-react";

export default function WhyUsSection() {
  const values = [
    {
      title: "QUALITY",
      desc: "Production-ready quality across all assets.",
      icon: <CheckCircle2 className="w-5 h-5 text-[#d4ff00]" aria-hidden="true" />,
    },
    {
      title: "COMMUNICATION",
      desc: "Clear communication throughout the project.",
      icon: <MessageSquare className="w-5 h-5 text-[#d4ff00]" aria-hidden="true" />,
    },
    {
      title: "FLEXIBILITY",
      desc: "Adaptive options for your specific requirements.",
      icon: <Sliders className="w-5 h-5 text-[#d4ff00]" aria-hidden="true" />,
    },
    {
      title: "RELIABLE DELIVERY",
      desc: "Deadlines and milestones that stay on schedule.",
      icon: <Clock className="w-5 h-5 text-[#d4ff00]" aria-hidden="true" />,
    },
  ];

  return (
    <section aria-label="Why Work With Moon 3D Studio" className="py-24 md:py-32 bg-[#0b0d12] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-2">
            WHY WORK WITH US?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Built for reliability, speed, and high-fidelity standards.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val) => (
            <div
              key={val.title}
              className="p-6 rounded-xl bg-[#12151b] border border-white/8 hover:border-[#d4ff00]/30 transition-all"
            >
              <div className="mb-4">
                {val.icon}
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight mb-2">
                {val.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
