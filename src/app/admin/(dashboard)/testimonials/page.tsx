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

interface Testimonial {
  id: string;
  clientName: string;
  company: string | null;
  quote: string;
  project: string | null;
  image: string | null;
  published: boolean;
  sortOrder: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    clientName: "",
    company: "",
    quote: "",
    project: "",
    image: "",
    published: true,
    sortOrder: 0,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/admin/testimonials");
        if (res.ok && !ignore) {
          const data = await res.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadTestimonials();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: "",
      company: "",
      quote: "",
      project: "",
      image: "",
      published: true,
      sortOrder: testimonials.length,
    });
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({
      clientName: t.clientName,
      company: t.company || "",
      quote: t.quote,
      project: t.project || "",
      image: t.image || "",
      published: t.published,
      sortOrder: t.sortOrder,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ togglePublished: true }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, published: !t.published } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : "/api/admin/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save testimonial.");
        setSaving(false);
        return;
      }

      setModalOpen(false);
      fetchTestimonials();
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
            CLIENT FEEDBACK CMS
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            VERIFIED TESTIMONIALS
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] shadow-[0_0_15px_rgba(212,255,0,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          ADD TESTIMONIAL
        </button>
      </div>

      {/* Testimonials Table */}
      <div className="rounded-2xl bg-[#11141a] border border-white/8 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
            LOADING TESTIMONIALS...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs font-mono">
            No testimonials added yet. Click &ldquo;ADD TESTIMONIAL&rdquo; to add verified client feedback.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/40 border-b border-white/5">
                  <th className="py-3 px-5 font-semibold">CLIENT</th>
                  <th className="py-3 px-4 font-semibold">PROJECT</th>
                  <th className="py-3 px-4 font-semibold">QUOTE</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-5 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{t.clientName}</div>
                      {t.company && (
                        <div className="text-[11px] font-mono text-zinc-400">{t.company}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                      {t.project || "General Production"}
                    </td>
                    <td className="py-4 px-4 text-zinc-400 max-w-md line-clamp-2 text-xs italic">
                      &ldquo;{t.quote}&rdquo;
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggle(t.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                          t.published
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-600/20 text-zinc-400 border border-zinc-500/30"
                        }`}
                      >
                        {t.published ? (
                          <>
                            <Eye className="w-3 h-3" /> ACTIVE
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
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#d4ff00] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
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
          <div className="w-full max-w-xl bg-[#11141a] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-display font-extrabold text-xl text-white uppercase tracking-tight">
                {editingTestimonial ? "EDIT TESTIMONIAL" : "ADD CLIENT TESTIMONIAL"}
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
                    CLIENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    STUDIO / COMPANY
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Game Studios"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  PROJECT NAME / REFERENCE
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="e.g. Sci-Fi Tactical Rover"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00]"
                />
              </div>

              <MediaUploader
                label="CLIENT AVATAR / PHOTO (OPTIONAL)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                helperText="Client headshot or studio brand logo (JPG, PNG, WEBP)"
                allowVideo={false}
              />

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  CLIENT QUOTE / FEEDBACK *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Moon 3D Studio delivered the vehicle assets on time with clean quad topology and ready-to-rig setup..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4ff00] resize-none"
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
                      <Save className="w-4 h-4" /> SAVE TESTIMONIAL
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
