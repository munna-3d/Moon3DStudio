"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
} from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  heroImage: string | null;
  highlights: string;
  deliverables: string;
  published: boolean;
  sortOrder: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    iconName: "box",
    heroImage: "",
    highlights: "",
    deliverables: "",
    published: true,
    sortOrder: 0,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadServices() {
      try {
        const res = await fetch("/api/admin/services");
        if (res.ok && !ignore) {
          const data = await res.json();
          setServices(data.services || []);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadServices();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      id: "new-service",
      title: "",
      slug: "",
      shortDesc: "",
      fullDesc: "",
      iconName: "box",
      heroImage: "",
      highlights: "Sub-D Precision, Clean Edge Flow",
      deliverables: ".FBX source files, PBR Texture maps",
      published: true,
      sortOrder: services.length,
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    let hlStr = "";
    let delStr = "";
    try {
      hlStr = Array.isArray(JSON.parse(s.highlights))
        ? JSON.parse(s.highlights).join(", ")
        : s.highlights;
    } catch {
      hlStr = s.highlights;
    }
    try {
      delStr = Array.isArray(JSON.parse(s.deliverables))
        ? JSON.parse(s.deliverables).join(", ")
        : s.deliverables;
    } catch {
      delStr = s.deliverables;
    }

    setFormData({
      id: s.id,
      title: s.title,
      slug: s.slug,
      shortDesc: s.shortDesc,
      fullDesc: s.fullDesc,
      iconName: s.iconName,
      heroImage: s.heroImage || "",
      highlights: hlStr,
      deliverables: delStr,
      published: s.published,
      sortOrder: s.sortOrder,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ togglePublished: true }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      ...formData,
      highlights: formData.highlights.split(",").map((s) => s.trim()).filter(Boolean),
      deliverables: formData.deliverables.split(",").map((s) => s.trim()).filter(Boolean),
      sortOrder: Number(formData.sortOrder),
    };

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save service.");
        setSaving(false);
        return;
      }

      setModalOpen(false);
      fetchServices();
    } catch {
      setFormError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-widest mb-1">
            SERVICES CMS
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            PRODUCTION SERVICES
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_15px_rgba(212,255,0,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          ADD SERVICE
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-[#11141a] border border-white/8 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
            LOADING SERVICES...
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs font-mono">
            No services configured in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/40 border-b border-white/5">
                  <th className="py-3 px-5 font-semibold">SERVICE</th>
                  <th className="py-3 px-4 font-semibold">ICON</th>
                  <th className="py-3 px-4 font-semibold">DESCRIPTION</th>
                  <th className="py-3 px-4 font-semibold">ORDER</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-5 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm uppercase">{s.title}</div>
                      <div className="text-[11px] font-mono text-zinc-400">#{s.id}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-[#d4ff00] uppercase">
                      {s.iconName}
                    </td>
                    <td className="py-4 px-4 text-zinc-400 max-w-sm line-clamp-2 text-xs">
                      {s.shortDesc}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                      {s.sortOrder}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggle(s.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                          s.published
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-600/20 text-zinc-400 border border-zinc-500/30"
                        }`}
                      >
                        {s.published ? (
                          <>
                            <Eye className="w-3 h-3" /> ACTIVE
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> HIDDEN
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#d4ff00] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#11141a] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-display font-extrabold text-xl text-white uppercase tracking-tight">
                {editingService ? "EDIT SERVICE" : "ADD NEW SERVICE"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    SERVICE TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                      setFormData({
                        ...formData,
                        title,
                        slug: editingService ? formData.slug : slug,
                        id: editingService ? formData.id : slug,
                      });
                    }}
                    placeholder="e.g. VEHICLES"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    ICON IDENTIFIER
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                  >
                    <option value="box">box (3D Modeling)</option>
                    <option value="gamepad">gamepad (Game-Ready Assets)</option>
                    <option value="car">car (Vehicles)</option>
                    <option value="shield">shield (Hard-Surface)</option>
                    <option value="sparkles">sparkles (Texturing)</option>
                    <option value="layers">layers (Environment)</option>
                  </select>
                </div>
              </div>

              <MediaUploader
                label="SERVICE FEATURE MEDIA / COVER (OPTIONAL)"
                value={formData.heroImage}
                onChange={(url) => setFormData({ ...formData, heroImage: url })}
                helperText="Optional showcase image or video for service page banner"
                allowVideo={true}
              />

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  SHORT DESCRIPTION (CARDS) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="High-quality detailed 3D models for games and digital experiences."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  FULL DETAILED OVERVIEW *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  placeholder="In-depth explanation of studio capabilities, polygon benchmarks, and workflow..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  CAPABILITIES (COMMA-SEPARATED)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Sub-D High Poly, Clean Non-destructive UVs, Zero Shading Artifacts"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  DELIVERABLES (COMMA-SEPARATED)
                </label>
                <input
                  type="text"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder=".FBX / .OBJ source files, Clean UVs, 4K PBR Liveries"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded bg-black border-white/20 accent-[#d4ff00]"
                  />
                  <span>PUBLISHED (VISIBLE TO PUBLIC)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
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
                  className="px-6 py-2 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-xs font-mono font-bold uppercase text-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> SAVE SERVICE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
