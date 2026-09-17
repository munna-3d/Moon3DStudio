"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Search,
  Check,
  Film,
  Image as ImageIcon,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface MediaItem {
  url: string;
  filename: string;
  folder: string;
  size: number;
  modified: string;
  isVideo: boolean;
  canDelete: boolean;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  allowVideo?: boolean;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  allowVideo = true,
}: MediaLibraryModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IMAGES" | "VIDEOS" | "UPLOADS">("ALL");
  const [selectedUrl, setSelectedUrl] = useState(currentValue || "");
  const uploadInputId = React.useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedUrl(currentValue || "");
      setUploadError("");
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function loadMedia() {
      try {
        const res = await fetch("/api/admin/media");
        if (res.ok && !ignore) {
          const data = await res.json();
          setMediaList(data.media || []);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadMedia();

    return () => {
      ignore = true;
    };
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to upload file");
        setUploading(false);
        return;
      }

      // Add to media list and auto-select immediately
      setSelectedUrl(data.url);
      await fetchMedia();
      onSelect(data.url);
      onClose();
    } catch {
      setUploadError("Network error during file upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMedia = async (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to permanently delete "${item.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(item.url)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.url !== item.url));
        if (selectedUrl === item.url) {
          setSelectedUrl("");
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting file");
    }
  };

  const filtered = mediaList.filter((item) => {
    if (!allowVideo && item.isVideo) return false;
    if (filterType === "IMAGES" && item.isVideo) return false;
    if (filterType === "VIDEOS" && !item.isVideo) return false;
    if (filterType === "UPLOADS" && item.folder !== "uploads") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.filename.toLowerCase().includes(q) ||
        item.folder.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-[#11141a] border border-white/15 rounded-2xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center text-[#d4ff00]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-white uppercase tracking-tight">
                STUDIO MEDIA LIBRARY
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Select an existing asset or upload high-res images and video renders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone & Filter Toolbar */}
        <div className="py-4 border-b border-white/10 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Direct Upload Button */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                id={uploadInputId}
                type="file"
                accept={allowVideo ? "image/*,video/*" : "image/*"}
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor={uploadInputId}
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,255,0,0.25)] select-none ${
                  uploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> UPLOADING...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 stroke-[2.5]" /> UPLOAD NEW MEDIA
                  </>
                )}
              </label>
              <span className="text-[11px] font-mono text-zinc-500 hidden md:inline">
                Supports JPG, PNG, WEBP, GIF, SVG, MP4, WEBM (Up to 100MB)
              </span>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets by name..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00]"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            {(["ALL", "IMAGES", "VIDEOS", "UPLOADS"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterType === tab
                    ? "bg-white/15 text-white font-bold border border-white/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
            <span className="ml-auto text-[11px] font-mono text-zinc-500">
              {filtered.length} {filtered.length === 1 ? "asset" : "assets"} found
            </span>
          </div>

          {uploadError && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[300px]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 py-20 text-zinc-400 text-xs font-mono">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
              LOADING MEDIA ASSETS...
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-16 text-center text-zinc-500">
              <ImageIcon className="w-10 h-10 text-zinc-600 stroke-[1.5]" />
              <div className="text-xs font-mono">No matching media files found.</div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs text-white font-mono"
              >
                Upload an asset now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filtered.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.url}
                    onClick={() => setSelectedUrl(item.url)}
                    onDoubleClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer bg-black/50 ${
                      isSelected
                        ? "border-[#d4ff00] ring-2 ring-[#d4ff00]/40 shadow-[0_0_15px_rgba(212,255,0,0.3)]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* Media Thumbnail */}
                    <div className="relative aspect-[16/10] w-full bg-[#090a0d] overflow-hidden">
                      {item.isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400">
                          <Film className="w-8 h-8 text-[#d4ff00] mb-1" />
                          <span className="text-[9px] font-mono uppercase">VIDEO CLIP</span>
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={item.filename}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#d4ff00] text-black flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Video / Type Pill */}
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1">
                        {item.isVideo ? (
                          <>
                            <Film className="w-2.5 h-2.5 text-[#d4ff00]" /> VIDEO
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-2.5 h-2.5 text-[#d4ff00]" /> {item.folder}
                          </>
                        )}
                      </div>

                      {/* Delete Button */}
                      {item.canDelete && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteMedia(item, e)}
                          title="Delete File Permanently"
                          className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/80 hover:bg-red-600 text-red-400 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2.5 bg-[#11141a]">
                      <div className="text-[11px] font-mono font-bold text-white truncate" title={item.filename}>
                        {item.filename}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                        <span>{formatFileSize(item.size)}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item.url);
                            onClose();
                          }}
                          className="px-2 py-0.5 rounded bg-[#d4ff00] hover:bg-[#bcf000] text-black font-bold uppercase text-[9px] cursor-pointer transition-colors shadow"
                        >
                          USE ASSET
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Selected Action */}
        <div className="pt-4 border-t border-white/10 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 truncate">
            <span className="text-zinc-500">Selected:</span>
            {selectedUrl ? (
              <span className="text-[#d4ff00] font-bold truncate max-w-sm sm:max-w-md">
                {selectedUrl}
              </span>
            ) : (
              <span className="italic text-zinc-600">None selected</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-bold uppercase text-zinc-300 transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="button"
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  onSelect(selectedUrl);
                  onClose();
                }
              }}
              className="px-6 py-2 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,255,0,0.3)] cursor-pointer"
            >
              USE SELECTED ASSET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
