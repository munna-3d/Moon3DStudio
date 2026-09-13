"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, Project } from "@/data/projects";
import TechDetailsModal from "./TechDetailsModal";

type FilterCategory = "ALL" | "VEHICLES" | "HARD SURFACE" | "ENVIRONMENT" | "OTHER";

export default function SelectedWorkSection() {
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
    <section id="work" className="py-24 md:py-32 bg-[#090a0d]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-2">
              SELECTED WORK
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-normal">
              A selection of our recent 3D projects.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterCategories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    isActive
                      ? "bg-[#d4ff00] text-black shadow-[0_0_12px_rgba(212,255,0,0.3)]"
                      : "bg-[#14171e] text-zinc-400 hover:text-white hover:bg-[#1a1f29] border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-[#11141a] border border-white/8 hover:border-[#d4ff00]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              {/* Image Container */}
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

              {/* Card Meta & Title */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1">
                    {project.categoryLabel}
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight group-hover:text-[#d4ff00] transition-colors">
                    <Link href={`/work/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  {project.actionText === "Technical Details +" ? (
                    <button
                      onClick={() => setSelectedTechProject(project)}
                      className="text-xs font-mono font-medium text-zinc-400 hover:text-[#d4ff00] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Technical Details +
                    </button>
                  ) : (
                    <Link
                      href={`/work/${project.slug}`}
                      className="text-xs font-mono font-medium text-[#d4ff00] hover:text-[#bcf000] transition-colors flex items-center gap-1"
                    >
                      EXPLORE MODEL ↗
                    </Link>
                  )}
                  <span className="text-[11px] font-mono text-zinc-400">
                    {project.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Technical Details Modal */}
      <TechDetailsModal
        project={selectedTechProject}
        onClose={() => setSelectedTechProject(null)}
      />
    </section>
  );
}
