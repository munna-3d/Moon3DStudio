"use client";

import React, { useEffect } from "react";
import { Project } from "@/data/projects";
import { X, Layers, Cpu, Box, FileText, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TechDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function TechDetailsModal({ project, onClose }: TechDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#11141a] border border-white/15 rounded-xl shadow-2xl p-6 md:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon accent top glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-12 bg-[#d4ff00]/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close technical specifications modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#d4ff00] mb-2 uppercase">
          <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />
          TECHNICAL SPECIFICATIONS
        </div>
        <h3 id="modal-project-title" className="font-display font-bold text-2xl text-white uppercase mb-4">
          {project.title}
        </h3>

        {/* Preview Thumbnail */}
        <div className="relative w-full h-44 rounded-lg overflow-hidden border border-white/10 mb-6 bg-black">
          <Image
            src={project.heroImage}
            alt={`${project.title} — ${project.categoryLabel} 3D asset model showcase preview`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141a] via-transparent to-transparent" />
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Box className="w-4 h-4 text-[#d4ff00]" aria-hidden="true" />
              <span className="uppercase tracking-wider">Triangle Count</span>
            </div>
            <div className="font-mono text-sm font-semibold text-white">
              {project.triangles}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Layers className="w-4 h-4 text-[#d4ff00]" aria-hidden="true" />
              <span className="uppercase tracking-wider">Texture Resolution</span>
            </div>
            <div className="font-mono text-sm font-semibold text-white">
              {project.textureResolution}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Cpu className="w-4 h-4 text-[#d4ff00]" aria-hidden="true" />
              <span className="uppercase tracking-wider">Target Engine</span>
            </div>
            <div className="font-mono text-sm font-semibold text-white">
              {project.engine}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <FileText className="w-4 h-4 text-[#d4ff00]" aria-hidden="true" />
              <span className="uppercase tracking-wider">Production Software</span>
            </div>
            <div className="font-mono text-xs font-medium text-white flex flex-wrap gap-1 mt-1">
              {project.software.join(" • ")}
            </div>
          </div>
        </div>

        {/* Deliverables / Scope */}
        <div className="mb-6">
          <h4 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
            Asset Features & Deliverables
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.services.map((srv) => (
              <div key={srv} className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" aria-hidden="true" />
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
          <Link
            href={`/work/${project.slug}`}
            onClick={onClose}
            className="text-xs font-bold tracking-wider uppercase text-[#d4ff00] hover:underline"
          >
            VIEW FULL CASE STUDY ↗
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
