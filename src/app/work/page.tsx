"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, Project } from "@/data/projects";
import TechDetailsModal from "@/components/home/TechDetailsModal";
import { ArrowUpRight } from "lucide-react";

type FilterCategory = "ALL" | "VEHICLES" | "HARD SURFACE" | "ENVIRONMENT" | "OTHER";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");
  const [selectedTechProject, setSelectedTechProject] = useState<Project | null>(null);

  const filterCategories: FilterCategory[] = [
    "ALL",
    "VEHICLES",
    "HARD SURFACE",
    "ENVIRONMENT",
    "OTHER",
  ];

  const filteredProjects =
    activeFilter === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="pt-32 pb-24 bg-[#090a0d] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase text-[#d4ff00] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
            STUDIO PORTFOLIO
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            OUR WORK
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed">
            A showcase of production-ready 3D models, military vehicles, sci-fi weaponry,
            and modular environment assets engineered for real-time game engines.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/10">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#d4ff00] text-black shadow-[0_0_15px_rgba(212,255,0,0.3)]"
                    : "bg-[#12151b] text-zinc-400 hover:text-white hover:bg-[#181d26] border border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-[#11141a] border border-white/8 hover:border-[#d4ff00]/40 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
            >
              <Link
                href={`/work/${project.slug}`}
                className="relative w-full aspect-[16/10] overflow-hidden bg-black block"
              >
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141a] via-transparent to-transparent opacity-80" />
              </Link>

              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1">
                    {project.categoryLabel}
                  </div>
                  <h2 className="font-display font-bold text-lg text-white uppercase tracking-tight group-hover:text-[#d4ff00] transition-colors mb-2">
                    <Link href={`/work/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTechProject(project)}
                    className="text-xs font-mono font-medium text-zinc-400 hover:text-[#d4ff00] transition-colors cursor-pointer"
                  >
                    Technical Details +
                  </button>
                  <Link
                    href={`/work/${project.slug}`}
                    className="text-xs font-mono font-medium text-[#d4ff00] hover:text-[#bcf000] flex items-center gap-1"
                  >
                    EXPLORE ↗
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Conversion Banner */}
        <div className="p-8 md:p-12 rounded-2xl bg-[#11141a] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase mb-2">
              NEED BESPOKE 3D ASSETS FOR YOUR PROJECT?
            </h3>
            <p className="text-zinc-400 text-sm max-w-xl">
              From concept designs to complete asset packs ready for Unreal Engine 5 or Unity, we deliver on time and to exact studio specs.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all shrink-0"
          >
            START A PROJECT
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      <TechDetailsModal
        project={selectedTechProject}
        onClose={() => setSelectedTechProject(null)}
      />
    </div>
  );
}
