"use client";

import React, { useState } from "react";
import { ArrowUpRight, UploadCloud, X, CheckCircle2, Loader2, File } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    "3D Modeling",
    "Game-Ready Assets",
  ]);
  const [timeline, setTimeline] = useState("Within 1 Month");
  const [budget, setBudget] = useState("$1000 - $3000");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const needsOptions = [
    "3D Modeling",
    "Game-Ready Assets",
    "Vehicles",
    "Hard Surface",
    "Environment",
  ];

  const toggleNeed = (option: string) => {
    if (selectedNeeds.includes(option)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== option));
    } else {
      setSelectedNeeds([...selectedNeeds, option]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Please enter both your name and email address.");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#090a0d] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-3">
            HAVE A PROJECT IN MIND?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#11141a] border border-white/10 shadow-2xl relative overflow-hidden">
          {isSubmitted ? (
            <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#d4ff00]/10 border border-[#d4ff00] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#d4ff00]" />
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                PROJECT BRIEF RECEIVED
              </h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{name}</span>. We&apos;ve
                received your project requirements and will review your specifications
                shortly. Expect our response within 24 hours at{" "}
                <span className="text-[#d4ff00]">{email}</span>.
              </p>
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setCompany("");
                    setMessage("");
                    setUploadedFiles([]);
                  }}
                  className="px-6 py-2.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  SUBMIT ANOTHER BRIEF
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  COMPANY (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company or studio name"
                  className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
                />
              </div>

              {/* What Do You Need Pills */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  WHAT DO YOU NEED?
                </label>
                <div className="flex flex-wrap gap-2">
                  {needsOptions.map((opt) => {
                    const isSelected = selectedNeeds.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleNeed(opt)}
                        className={`px-3.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                          isSelected
                            ? "bg-[#d4ff00] text-black shadow-[0_0_12px_rgba(212,255,0,0.3)]"
                            : "bg-[#090a0d] text-zinc-400 hover:text-white border border-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline & Budget Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    TARGET TIMELINE (OPTIONAL)
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4ff00] transition-colors cursor-pointer"
                  >
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="1 - 3 Months">1 - 3 Months</option>
                    <option value="3 - 6 Months">3 - 6 Months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    ESTIMATED BUDGET
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4ff00] transition-colors cursor-pointer"
                  >
                    <option value="< $1000">&lt; $1,000</option>
                    <option value="$1000 - $3000">$1,000 - $3,000</option>
                    <option value="$3000 - $5000">$3,000 - $5,000</option>
                    <option value="$5000 - $10000">$5,000 - $10,000</option>
                    <option value="$10000+">$10,000+</option>
                  </select>
                </div>
              </div>

              {/* Project Description Textarea */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  TELL US ABOUT YOUR PROJECT
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly describe your project requirements, scope, references, deadlines..."
                  className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors resize-none"
                />
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  PROJECT REFERENCES / ASSET BRIEF (OPTIONAL)
                </label>
                <div className="relative border border-dashed border-white/15 rounded-xl p-5 text-center hover:border-[#d4ff00]/50 transition-colors bg-[#090a0d]/50">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.zip,.rar"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <UploadCloud className="w-7 h-7 text-zinc-400 mb-2" />
                    <p className="text-xs text-zinc-300 font-medium">
                      Drag & drop references here, or{" "}
                      <span className="text-[#d4ff00]">browse files</span>
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-1">
                      Supports JPG, PNG, PDF, ZIP, RAR (Max 50MB)
                    </p>
                  </div>
                </div>

                {/* Uploaded File List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 text-xs text-zinc-300"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <File className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-zinc-400 text-[10px] font-mono shrink-0">
                            ({file.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 hover:text-red-400 text-zinc-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg bg-[#d4ff00] text-black hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SENDING INQUIRY...
                  </>
                ) : (
                  <>
                    SEND INQUIRY
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
