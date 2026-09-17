"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  Film,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Folder,
  X,
  Play,
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

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "IMAGES" | "VIDEOS" | "UPLOADS" | "PROJECTS">("ALL");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
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

  useEffect(() => {
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
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          setUploadError(errData.error || `Failed to upload ${files[i].name}`);
          break;
        }
      }
      await fetchMedia();
    } catch {
      setUploadError("Network error during file upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(item.url)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.url !== item.url));
        if (previewItem?.url === item.url) setPreviewItem(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = mediaList.filter((item) => {
    if (filterTab === "IMAGES" && item.isVideo) return false;
    if (filterTab === "VIDEOS" && !item.isVideo) return false;
    if (filterTab === "UPLOADS" && item.folder !== "uploads") return false;
    if (filterTab === "PROJECTS" && !item.folder.startsWith("projects")) return false;

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

  const totalSize = mediaList.reduce((acc, curr) => acc + curr.size, 0);
  const totalImages = mediaList.filter((m) => !m.isVideo).length;
  const totalVideos = mediaList.filter((m) => m.isVideo).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-widest mb-1">
            ASSET STORAGE & MEDIA CMS
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            MEDIA LIBRARY
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#d4ff00]" : ""}`} />
          </button>

          <input
            ref={fileInputRef}
            id="admin-media-upload-input"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />

          <label
            htmlFor="admin-media-upload-input"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2.5 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,255,0,0.3)] select-none ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> UPLOADING...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 stroke-[2.5]" /> UPLOAD ASSETS
              </>
            )}
          </label>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#11141a] border border-white/8">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">TOTAL ASSETS</div>
          <div className="font-display font-extrabold text-2xl text-white mt-1">
            {mediaList.length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#11141a] border border-white/8">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">IMAGES</div>
          <div className="font-display font-extrabold text-2xl text-[#d4ff00] mt-1">
            {totalImages}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#11141a] border border-white/8">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">VIDEOS</div>
          <div className="font-display font-extrabold text-2xl text-cyan-400 mt-1">
            {totalVideos}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#11141a] border border-white/8">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">STORAGE USAGE</div>
          <div className="font-display font-extrabold text-2xl text-zinc-300 mt-1">
            {formatFileSize(totalSize)}
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
          {uploadError}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#11141a] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          {(["ALL", "IMAGES", "VIDEOS", "UPLOADS", "PROJECTS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterTab === tab
                  ? "bg-[#d4ff00] text-black font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by filename..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090a0d] border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00]"
          />
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="rounded-2xl bg-[#11141a] border border-white/8 p-5 shadow-xl">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
            <Loader2 className="w-7 h-7 animate-spin text-[#d4ff00]" />
            LOADING STUDIO MEDIA ASSETS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs font-mono space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto text-zinc-600 stroke-[1.5]" />
            <div>No media assets matching your filter criteria.</div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase"
            >
              Upload Assets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.url}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#d4ff00]/60 bg-[#090a0d] transition-all flex flex-col"
              >
                {/* Media Thumbnail */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden cursor-pointer"
                >
                  {item.isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 group-hover:bg-zinc-900 transition-colors text-zinc-400">
                      <Film className="w-10 h-10 text-[#d4ff00] mb-2" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                        VIDEO RENDER
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-[#d4ff00] text-black flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Folder Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1">
                    <Folder className="w-2.5 h-2.5 text-[#d4ff00]" />
                    <span>{item.folder}</span>
                  </div>

                  {/* Video Badge */}
                  {item.isVideo && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                      <Film className="w-2.5 h-2.5" /> VIDEO
                    </div>
                  )}

                  {/* Quick Delete Overlay Button */}
                  {item.canDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-red-600 text-zinc-300 hover:text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md z-10"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Info & Actions */}
                <div className="p-3 flex-1 flex flex-col justify-between bg-[#11141a]">
                  <div>
                    <div
                      className="font-mono font-bold text-xs text-white truncate hover:text-[#d4ff00] cursor-pointer"
                      onClick={() => setPreviewItem(item)}
                      title={item.filename}
                    >
                      {item.filename}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                      <span>{formatFileSize(item.size)}</span>
                      <span>{new Date(item.modified).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer ${
                        copiedUrl === item.url
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/5 hover:bg-white/10 text-zinc-300"
                      }`}
                      title="Copy Public URL"
                    >
                      {copiedUrl === item.url ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" /> COPIED
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> COPY URL
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {item.canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#11141a] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="truncate pr-4">
                <div className="font-bold text-sm text-white truncate font-mono">
                  {previewItem.filename}
                </div>
                <div className="text-[11px] font-mono text-[#d4ff00]">
                  {previewItem.url}
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center p-4 overflow-hidden min-h-[350px]">
              {previewItem.isVideo ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  className="max-h-[65vh] max-w-full rounded-lg"
                />
              ) : (
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={previewItem.url}
                    alt={previewItem.filename}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#11141a]">
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-4">
                <span>Size: {formatFileSize(previewItem.size)}</span>
                <span>Folder: {previewItem.folder}</span>
              </div>

              <div className="flex items-center gap-2">
                {previewItem.canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(previewItem)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Delete this asset permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Asset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCopy(previewItem.url)}
                  className="px-3 py-1.5 rounded-lg bg-[#d4ff00] text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
