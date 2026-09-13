import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Box, Layers, Cpu, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — Moon 3D Studio",
    };
  }

  return {
    title: `${project.title} — Moon 3D Studio Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Moon 3D Studio`,
      description: project.description,
      images: [project.heroImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  // Additional renders excluding the main hero image
  const additionalRenders = project.gallery.filter((img) => img !== project.heroImage);

  return (
    <div className="pt-28 pb-24 bg-[#090a0d] min-h-screen text-white">
      {/* Back Link & Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase text-zinc-400 hover:text-[#d4ff00] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO ALL PROJECTS</span>
        </Link>
      </div>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="max-w-4xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest uppercase text-[#d4ff00] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
            {project.categoryLabel}
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white mb-4">
            {project.title}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
            {project.longDescription || project.description}
          </p>
        </div>

        {/* Hero Showcase Image */}
        <div className="relative w-full aspect-[16/9] lg:aspect-[21/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-12">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1400px) 100vw, 1400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d]/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl bg-[#11141a] border border-white/8 mb-16 shadow-lg">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
              CATEGORY
            </span>
            <span className="text-sm font-semibold text-white tracking-wide">
              {project.categoryLabel}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
              YEAR
            </span>
            <span className="text-sm font-semibold text-white tracking-wide">
              {project.year}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
              ENGINE TARGET
            </span>
            <span className="text-sm font-semibold text-white tracking-wide truncate block">
              {project.engine}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
              TRIANGLES
            </span>
            <span className="text-sm font-semibold font-mono text-[#d4ff00]">
              {project.triangles}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Left Column: Services & Overview */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-white mb-4">
                SCOPE & DELIVERABLES
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                Every component was crafted to deliver uncompromising visual fidelity while strictly adhering to real-time rendering budgets and performance benchmarks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.services.map((srv) => (
                  <div
                    key={srv}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#12151b] border border-white/5 text-xs text-zinc-300 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-white mb-4">
                PRODUCTION WORKFLOW
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                Modeled using non-destructive Sub-D workflows and precision CAD surface evaluation. High-to-low poly normal transfers were executed with zero distortion cages, followed by custom PBR map creation with authentic micro-roughness variances and edge wear details.
              </p>
            </div>
          </div>

          {/* Right Column: Technical Details Box */}
          <div className="lg:col-span-5 p-8 rounded-xl bg-[#11141a] border border-white/10 h-fit space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#d4ff00] uppercase">
              <ShieldCheck className="w-4 h-4 text-[#d4ff00]" />
              ENGINE SPECIFICATIONS
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                <Box className="w-5 h-5 text-[#d4ff00] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Geometry Budget</span>
                  <span className="text-xs font-mono font-semibold text-white">{project.triangles}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#d4ff00] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Texture Pipeline</span>
                  <span className="text-xs font-mono font-semibold text-white">{project.textureResolution}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#d4ff00] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Compatible Engine</span>
                  <span className="text-xs font-mono font-semibold text-white">{project.engine}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 block mb-2">
                TOOLS USED
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.software.map((sw) => (
                  <span
                    key={sw}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Renders & Breakdown Gallery */}
        {additionalRenders.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-white mb-1">
                  DETAILED RENDERS & TOPOLOGY
                </h2>
                <p className="text-xs text-zinc-400">
                  Multiple viewport angles and topology evaluation wireframes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {additionalRenders.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl overflow-hidden border border-white/10 bg-black shadow-xl"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={img}
                      alt={`${project.title} - View ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4 bg-[#11141a] border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-300">
                      {img.includes("wireframe") ? "Sub-D Quad Wireframe & Topology" : img.includes("front") ? "Front 3/4 Track Perspective" : img.includes("action") ? "Atmospheric In-Engine Scene" : `Camera Viewpoint 0${idx + 2}`}
                    </span>
                    <span className="text-[10px] font-mono text-[#d4ff00] uppercase tracking-wider">
                      {img.includes("wireframe") ? "TOPOLOGY INSPECT" : "4K RENDER"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Project & Bottom Conversion */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Next Project Card */}
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex items-center gap-4 p-4 rounded-xl bg-[#11141a] border border-white/8 hover:border-[#d4ff00]/40 transition-all w-full md:w-auto"
          >
            <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
              <Image
                src={nextProject.heroImage}
                alt={nextProject.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block mb-0.5">
                NEXT PROJECT →
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#d4ff00] transition-colors uppercase">
                {nextProject.title}
              </span>
            </div>
          </Link>

          {/* Start a Project CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_25px_rgba(212,255,0,0.35)] transition-all w-full md:w-auto justify-center"
          >
            START A PROJECT
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
