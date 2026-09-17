"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  FolderOpen,
  X,
  Film,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
} from "lucide-react";
import MediaLibraryModal from "./MediaLibraryModal";

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  allowVideo?: boolean;
  helperText?: string;
  required?: boolean;
}

export default function MediaUploader({
  label,
  value,
  onChange,
  allowVideo = true,
  helperText,
  required = false,
}: MediaUploaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputId = React.useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo =
    value &&
    (value.endsWith(".mp4") ||
      value.endsWith(".webm") ||
      value.endsWith(".ogg") ||
      value.endsWith(".mov"));

  const handleUploadFile = async (file: File) => {
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

      onChange(data.url);
    } catch {
      setUploadError("Upload failed due to network error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          {label} {required && <span className="text-[#d4ff00]">*</span>}
        </label>
        {helperText && (
          <span className="text-[10px] font-mono text-zinc-500">{helperText}</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept={allowVideo ? "image/*,video/*" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Preview Card */
        <div className="relative rounded-xl border border-white/15 bg-[#090a0d] p-3 overflow-hidden group">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Thumbnail Box */}
            <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
              {isVideo ? (
                <video
                  src={value}
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={value}
                  alt="Media preview"
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              )}

              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1">
                {isVideo ? (
                  <>
                    <Film className="w-2.5 h-2.5 text-[#d4ff00]" /> VIDEO
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-2.5 h-2.5 text-[#d4ff00]" /> IMAGE
                  </>
                )}
              </div>
            </div>

            {/* Path & Quick Actions */}
            <div className="flex-1 min-w-0 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="/projects/sample.webp or https://..."
                  className="w-full px-2.5 py-1.5 rounded bg-black/50 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#d4ff00]"
                />
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={fileInputId}
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer ${
                    uploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" /> Upload New File
                    </>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-2.5 py-1 rounded bg-[#d4ff00]/10 hover:bg-[#d4ff00]/20 text-[11px] font-mono font-medium text-[#d4ff00] border border-[#d4ff00]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3 h-3" /> Browse Library
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-[11px] font-mono text-red-400 transition-colors flex items-center gap-1 cursor-pointer ml-auto"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-4 sm:p-6 transition-all text-center ${
            isDragOver
              ? "border-[#d4ff00] bg-[#d4ff00]/5"
              : required && !value
              ? "border-amber-400/30 hover:border-amber-400/60 bg-[#090a0d]/70"
              : "border-white/10 hover:border-white/25 bg-[#090a0d]/60"
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-xs font-mono text-zinc-300">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
              <span>UPLOADING MEDIA ASSET...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                <Upload className="w-5 h-5 text-[#d4ff00]" />
              </div>

              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wide flex items-center justify-center gap-2">
                  <span>DROP IMAGE OR VIDEO HERE</span>
                  {required && !value && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-normal">
                      REQUIRED
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Supports JPG, PNG, WEBP, GIF, MP4, WEBM (Up to 100MB)
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <label
                  htmlFor={fileInputId}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#d4ff00] hover:bg-[#bcf000] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(212,255,0,0.25)] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" /> Upload File
                </label>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" /> Browse Library
                </button>
              </div>

              <div className="pt-2 border-t border-white/5 max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="Or paste image URL / path directly..."
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-[11px] font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="text-xs text-red-400 font-mono flex items-center gap-1.5">
          <span>Error: {uploadError}</span>
        </div>
      )}

      {/* Modal */}
      <MediaLibraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => onChange(url)}
        currentValue={value}
        allowVideo={allowVideo}
      />
    </div>
  );
}
