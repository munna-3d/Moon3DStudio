"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#11141a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#d4ff00]/20 blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-[#d4ff00]" />
          </div>
          <h1 className="font-display font-extrabold text-2xl uppercase tracking-tight text-white">
            STUDIO ADMIN
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Moon 3D Studio Management Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@moon3dstudio.com"
              className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#090a0d] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold tracking-widest uppercase rounded-lg bg-[#d4ff00] text-black hover:bg-[#bcf000] shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                ENTER DASHBOARD
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[11px] font-mono text-zinc-500">
            Protected endpoint • Moon 3D Studio Internal
          </p>
        </div>
      </div>
    </div>
  );
}
