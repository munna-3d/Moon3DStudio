import React from "react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "YOU SHARE YOUR BRIEF",
      desc: "Send your reference, requirements and project needs.",
    },
    {
      num: "02",
      title: "REVIEW",
      desc: "We analyze the scope, timeline and deliverables.",
    },
    {
      num: "03",
      title: "WE CREATE",
      desc: "Modeling, texture, and prepare the assets.",
    },
    {
      num: "04",
      title: "YOU RECEIVE FINAL ASSETS",
      desc: "Receive the assets for your project.",
    },
  ];

  return (
    <section aria-label="Production Workflow" className="py-24 md:py-32 bg-[#090a0d] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-2">
            HOW IT WORKS
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            A streamlined 4-step process from brief to final delivery.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-xl bg-[#11141a] border border-white/8 hover:border-[#d4ff00]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-2xl font-black text-[#d4ff00] mb-4 tracking-tighter">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
