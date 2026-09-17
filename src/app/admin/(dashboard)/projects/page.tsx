"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  X,
  Save,
  Film,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export interface ProjectImageItem {
  id?: string;
  url: string;
  altText?: string | null;
  caption?: string | null;
  sortOrder: number;
  imageType: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  categoryLabel: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  heroImage: string;
  thumbnailImage: string | null;
  client: string | null;
  year: string;
  triangleCount: string | null;
  textureResolution: string | null;
  engine: string | null;
  software: string;
  services: string;
  actionText: string | null;
  images?: ProjectImageItem[];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState<"DETAILS" | "MEDIA" | "GALLERY">("DETAILS");
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "VEHICLES",
    categoryLabel: "VEHICLE",
    shortDescription: "",
    description: "",
    heroImage: "",
    thumbnailImage: "",
    featured: false,
    published: true,
    sortOrder: 0,
    client: "",
    year: "2026",
    triangles: "150,000 Tris",
    textureResolution: "4K PBR Texture Sets",
    engine: "Unreal Engine 5",
    software: "Blender, Substance 3D Painter, UE5",
    services: "3D Modeling, PBR Texturing",
    actionText: "EXPLORE MODEL ↗",
    images: [] as ProjectImageItem[],
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadProjects() {
      try {
        const res = await fetch("/api/admin/projects");
        if (res.ok && !ignore) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setActiveTab("DETAILS");
    setFormData({
      title: "",
      slug: "",
      category: "VEHICLES",
      categoryLabel: "VEHICLE",
      shortDescription: "",
      description: "",
      heroImage: "/hero/hexa-bison-hero.webp",
      thumbnailImage: "",
      featured: false,
      published: true,
      sortOrder: projects.length,
      client: "Original Studio Asset",
      year: "2026",
      triangles: "140,000 Tris",
      textureResolution: "4K PBR Sets",
      engine: "Unreal Engine 5",
      software: "Blender, Substance 3D Painter, UE5",
      services: "Sub-D Modeling, PBR Texturing",
      actionText: "EXPLORE MODEL ↗",
      images: [],
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = async (p: Project) => {
    setEditingProject(p);
    setActiveTab("DETAILS");

    let swStr = "";
    let srvStr = "";
    try {
      swStr = Array.isArray(JSON.parse(p.software))
        ? JSON.parse(p.software).join(", ")
        : p.software;
    } catch {
      swStr = p.software;
    }
    try {
      srvStr = Array.isArray(JSON.parse(p.services))
        ? JSON.parse(p.services).join(", ")
        : p.services;
    } catch {
      srvStr = p.services;
    }

    let projectImages: ProjectImageItem[] = p.images || [];
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.project?.images) {
          projectImages = data.project.images;
        }
      }
    } catch {
      // fallback
    }

    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      categoryLabel: p.categoryLabel,
      shortDescription: p.shortDescription,
      description: p.description,
      heroImage: p.heroImage,
      thumbnailImage: p.thumbnailImage || "",
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
      client: p.client || "",
      year: p.year,
      triangles: p.triangleCount || "",
      textureResolution: p.textureResolution || "",
      engine: p.engine || "",
      software: swStr,
      services: srvStr,
      actionText: p.actionText || "EXPLORE MODEL ↗",
      images: projectImages,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleToggle = async (id: string, field: "published" | "featured") => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleField: field }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Proactive field validations
    if (!formData.title.trim()) {
      setActiveTab("DETAILS");
      setFormError("Project Title is required.");
      return;
    }

    if (!formData.slug.trim()) {
      setActiveTab("DETAILS");
      setFormError("URL Slug is required.");
      return;
    }

    if (!formData.shortDescription.trim() || formData.shortDescription.trim().length < 5) {
      setActiveTab("DETAILS");
      setFormError("Short Overview description must be at least 5 characters.");
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setActiveTab("DETAILS");
      setFormError("Detailed Case Study description must be at least 10 characters.");
      return;
    }

    if (!formData.heroImage || !formData.heroImage.trim()) {
      setActiveTab("MEDIA");
      setFormError("Hero Image / Video Cover is required. Please upload or choose a cover media for this project.");
      return;
    }

    setSaving(true);

    const payload = {
      ...formData,
      software: formData.software
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      services: formData.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sortOrder: Number(formData.sortOrder),
      images: formData.images.map((img, idx) => ({
        ...img,
        sortOrder: idx,
      })),
    };

    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save project.");
        setSaving(false);
        return;
      }

      setModalOpen(false);
      fetchProjects();
    } catch {
      setFormError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url,
          altText: `${prev.title} breakdown pass`,
          caption: "High-Poly Render",
          sortOrder: prev.images.length,
          imageType: "FINAL",
        },
      ],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= formData.images.length) return;

    setFormData((prev) => {
      const copy = [...prev.images];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return { ...prev, images: copy };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-widest mb-1">
            PORTFOLIO CMS
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            PROJECT MANAGEMENT
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_15px_rgba(212,255,0,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          CREATE PROJECT
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-[#11141a] border border-white/8 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
            LOADING PROJECTS...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs font-mono">
            No projects in database. Click &ldquo;CREATE PROJECT&rdquo; to add your first asset.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/40 border-b border-white/5">
                  <th className="py-3 px-5 font-semibold">PROJECT & MEDIA</th>
                  <th className="py-3 px-4 font-semibold">CATEGORY</th>
                  <th className="py-3 px-4 font-semibold">ENGINE & POLYGON</th>
                  <th className="py-3 px-4 font-semibold">GALLERY</th>
                  <th className="py-3 px-4 font-semibold">FEATURED</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-5 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                          {p.heroImage?.endsWith(".mp4") || p.heroImage?.endsWith(".webm") ? (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[#d4ff00]">
                              <Film className="w-4 h-4" />
                            </div>
                          ) : (
                            <Image
                              src={p.heroImage}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm uppercase">
                            {p.title}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400">
                            /work/{p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {p.categoryLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">
                      <div className="text-[#d4ff00] font-semibold">{p.triangleCount || "N/A"}</div>
                      <div>{p.engine || "Unreal Engine 5"}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                        {p.images?.length || 0} passes
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggle(p.id, "featured")}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          p.featured
                            ? "text-[#d4ff00] bg-[#d4ff00]/10 hover:bg-[#d4ff00]/20"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title={p.featured ? "Featured Project" : "Click to Feature"}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? "fill-[#d4ff00]" : ""}`} />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggle(p.id, "published")}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                          p.published
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-600/20 text-zinc-400 border border-zinc-500/30"
                        }`}
                      >
                        {p.published ? (
                          <>
                            <Eye className="w-3 h-3" /> PUBLISHED
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> DRAFT
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#d4ff00] transition-colors cursor-pointer"
                          title="Edit Project & Media"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#11141a] border border-white/15 rounded-2xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00]" />
                <h2 className="font-display font-extrabold text-xl text-white uppercase tracking-tight">
                  {editingProject ? "EDIT 3D PROJECT & MEDIA" : "CREATE NEW 3D PROJECT"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 py-3 border-b border-white/10 shrink-0 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab("DETAILS")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "DETAILS"
                    ? "bg-[#d4ff00] text-black font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                1. SPECS & OVERVIEW
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("MEDIA")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "MEDIA"
                    ? "bg-[#d4ff00] text-black font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> 2. HERO & COVER MEDIA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("GALLERY")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "GALLERY"
                    ? "bg-[#d4ff00] text-black font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> 3. BREAKDOWN GALLERY ({formData.images.length})
              </button>
            </div>

            {formError && (
              <div className="p-3.5 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium shrink-0 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-5">
              {/* TAB 1: SPECS & OVERVIEW */}
              {activeTab === "DETAILS" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        PROJECT TITLE *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "");
                          setFormData({
                            ...formData,
                            title,
                            slug: editingProject ? formData.slug : slug,
                          });
                        }}
                        placeholder="e.g. HEXA BISON VX-2.0"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        URL SLUG *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. hexa-bison-vx2"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        CATEGORY
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                            categoryLabel:
                              e.target.value === "VEHICLES"
                                ? "VEHICLE"
                                : e.target.value === "HARD SURFACE"
                                ? "HARD SURFACE"
                                : "ENVIRONMENT",
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                      >
                        <option value="VEHICLES">VEHICLES</option>
                        <option value="HARD SURFACE">HARD SURFACE</option>
                        <option value="ENVIRONMENT">ENVIRONMENT</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        TRIANGLE COUNT
                      </label>
                      <input
                        type="text"
                        value={formData.triangles}
                        onChange={(e) => setFormData({ ...formData, triangles: e.target.value })}
                        placeholder="e.g. 165,000 Tris"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        ENGINE TARGET
                      </label>
                      <input
                        type="text"
                        value={formData.engine}
                        onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                        placeholder="e.g. Unreal Engine 5"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      SHORT OVERVIEW (PORTFOLIO CARD) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, shortDescription: e.target.value })
                      }
                      placeholder="High-performance off-road rally prototype featuring carbon-fiber widebody aero..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      DETAILED CASE STUDY DESCRIPTION *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Comprehensive technical breakdown of Sub-D workflow, topology, and PBR texturing..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        SOFTWARE USED (COMMA-SEPARATED)
                      </label>
                      <input
                        type="text"
                        value={formData.software}
                        onChange={(e) => setFormData({ ...formData, software: e.target.value })}
                        placeholder="Blender, Substance 3D Painter, Unreal Engine 5"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        SERVICES DELIVERED (COMMA-SEPARATED)
                      </label>
                      <input
                        type="text"
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                        placeholder="Concept Design, Sub-D High-Poly, Retopology, 4K PBR"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({ ...formData, published: e.target.checked })
                        }
                        className="w-4 h-4 rounded bg-black border-white/20 accent-[#d4ff00]"
                      />
                      <span>PUBLISHED (VISIBLE TO PUBLIC)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded bg-black border-white/20 accent-[#d4ff00]"
                      />
                      <span>FEATURED ON HOMEPAGE</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO & COVER MEDIA */}
              {activeTab === "MEDIA" && (
                <div className="space-y-6">
                  {/* Hero Media Uploader */}
                  <MediaUploader
                    label="HERO IMAGE / VIDEO COVER *"
                    value={formData.heroImage}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                    helperText="Main showcase image or loop video rendered on project page and hero cards"
                    allowVideo={true}
                    required={true}
                  />

                  {/* Thumbnail Image Uploader */}
                  <MediaUploader
                    label="THUMBNAIL IMAGE (OPTIONAL)"
                    value={formData.thumbnailImage}
                    onChange={(url) => setFormData({ ...formData, thumbnailImage: url })}
                    helperText="Optional square or cropped thumbnail for compact portfolio listings"
                    allowVideo={false}
                    required={false}
                  />
                </div>
              )}

              {/* TAB 3: BREAKDOWN GALLERY */}
              {activeTab === "GALLERY" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#090a0d] border border-white/10">
                    <div>
                      <div className="font-bold text-xs text-white uppercase tracking-wide">
                        CASE STUDY BREAKDOWN PASSES
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        Add clay renders, wireframes, UV maps, 4K texture passes, and turntable videos
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGalleryModalOpen(true)}
                      className="px-3.5 py-2 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,255,0,0.25)] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD BREAKDOWN PASS
                    </button>
                  </div>

                  {formData.images.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-white/10 rounded-xl text-center text-zinc-500 text-xs font-mono space-y-2">
                      <ImageIcon className="w-8 h-8 mx-auto text-zinc-600" />
                      <div>No breakdown passes attached to this project.</div>
                      <button
                        type="button"
                        onClick={() => setGalleryModalOpen(true)}
                        className="text-[#d4ff00] hover:underline"
                      >
                        Click here to add your first breakdown pass
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.images.map((img, idx) => {
                        const isVid =
                          img.url.endsWith(".mp4") ||
                          img.url.endsWith(".webm") ||
                          img.url.endsWith(".ogg");
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#090a0d] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
                          >
                            {/* Pass Thumbnail */}
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0">
                              {isVid ? (
                                <div className="w-full h-full flex items-center justify-center text-[#d4ff00]">
                                  <Film className="w-5 h-5" />
                                </div>
                              ) : (
                                <Image
                                  src={img.url}
                                  alt={img.caption || `Pass ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>

                            {/* Pass Controls */}
                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                              <div>
                                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-0.5">
                                  PASS TYPE
                                </label>
                                <select
                                  value={img.imageType}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev) => {
                                      const copy = [...prev.images];
                                      copy[idx] = { ...copy[idx], imageType: val };
                                      return { ...prev, images: copy };
                                    });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4ff00]"
                                >
                                  <option value="FINAL">FINAL BEAUTY</option>
                                  <option value="WIREFRAME">WIREFRAME</option>
                                  <option value="TEXTURE">TEXTURE BREAKDOWN</option>
                                  <option value="UV">UV MAP</option>
                                  <option value="ENGINE">ENGINE IN-GAME</option>
                                  <option value="DETAIL">DETAIL CLOSEUP</option>
                                  <option value="OTHER">OTHER</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-0.5">
                                  CAPTION / TITLE
                                </label>
                                <input
                                  type="text"
                                  value={img.caption || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev) => {
                                      const copy = [...prev.images];
                                      copy[idx] = { ...copy[idx], caption: val };
                                      return { ...prev, images: copy };
                                    });
                                  }}
                                  placeholder="e.g. Sub-D Topology Cage"
                                  className="w-full px-2 py-1 rounded bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-0.5">
                                  MEDIA URL
                                </label>
                                <input
                                  type="text"
                                  value={img.url}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev) => {
                                      const copy = [...prev.images];
                                      copy[idx] = { ...copy[idx], url: val };
                                      return { ...prev, images: copy };
                                    });
                                  }}
                                  className="w-full px-2 py-1 rounded bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4ff00]"
                                />
                              </div>
                            </div>

                            {/* Reorder and Delete Actions */}
                            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveGalleryImage(idx, "up")}
                                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === formData.images.length - 1}
                                onClick={() => moveGalleryImage(idx, "down")}
                                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                                title="Remove Pass"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      formData.published
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-zinc-700/20 text-zinc-400"
                    }`}
                  >
                    {formData.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-bold uppercase text-zinc-300 transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-xs font-mono font-bold uppercase text-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 shadow-[0_0_15px_rgba(212,255,0,0.3)]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> SAVE PROJECT & MEDIA
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Breakdown Passes */}
      <MediaLibraryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onSelect={(url) => addGalleryImage(url)}
        allowVideo={true}
      />
    </div>
  );
}
