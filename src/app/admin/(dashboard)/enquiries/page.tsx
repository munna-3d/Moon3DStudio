"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Trash2,
  X,
  Loader2,
  FileIcon,
  ExternalLink,
} from "lucide-react";

type EnquiryStatus = "ALL" | "NEW" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED" | "SPAM";

interface Attachment {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  description: string;
  timeline: string | null;
  budget: string | null;
  referenceUrl: string | null;
  status: string;
  createdAt: string;
  attachments: Attachment[];
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
        });
        if (statusFilter !== "ALL") params.append("status", statusFilter);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setEnquiries(data.enquiries || []);
          setTotalPages(data.pagination.totalPages || 1);
        }
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [statusFilter, searchQuery, page]);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (enquiryId: string) => {
    if (!confirm("Are you sure you want to permanently delete this project enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
        if (selectedEnquiry?.id === enquiryId) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusList: EnquiryStatus[] = [
    "ALL",
    "NEW",
    "CONTACTED",
    "IN_PROGRESS",
    "COMPLETED",
    "ARCHIVED",
    "SPAM",
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-[#d4ff00]/15 text-[#d4ff00] border-[#d4ff00]/30";
      case "CONTACTED":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "IN_PROGRESS":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "COMPLETED":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "ARCHIVED":
        return "bg-zinc-600/20 text-zinc-400 border-zinc-500/30";
      case "SPAM":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      default:
        return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-widest mb-1">
          INBOX & PIPELINE
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
          PROJECT ENQUIRIES
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#11141a] border border-white/8">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusList.map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#d4ff00] text-black font-bold shadow-[0_0_12px_rgba(212,255,0,0.25)]"
                  : "bg-black/30 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search name, email, brief..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-[#090a0d] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff00] transition-colors"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-2xl bg-[#11141a] border border-white/8 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-[#d4ff00]" />
            LOADING ENQUIRIES...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs font-mono">
            No project enquiries match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-black/40 border-b border-white/5">
                  <th className="py-3 px-5 font-semibold">DATE</th>
                  <th className="py-3 px-4 font-semibold">CLIENT</th>
                  <th className="py-3 px-4 font-semibold">PROJECT TYPE</th>
                  <th className="py-3 px-4 font-semibold">BUDGET & TIMELINE</th>
                  <th className="py-3 px-4 font-semibold">FILES</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-5 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {enquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{enq.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{enq.email}</div>
                      {enq.company && (
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {enq.company}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      <span className="font-semibold">{enq.projectType}</span>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 max-w-xs font-normal">
                        {enq.description}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      <div className="text-[#d4ff00] font-semibold">{enq.budget || "$1000 - $3000"}</div>
                      <div className="text-zinc-500">{enq.timeline || "Flexible"}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px]">
                      {enq.attachments.length > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#d4ff00] whitespace-nowrap">
                          {enq.attachments.length} attachment(s)
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(enq);
                        }}
                        className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-[#d4ff00] text-[11px] font-mono font-bold transition-colors cursor-pointer"
                      >
                        VIEW BRIEF ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal / Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-[#11141a] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${getStatusBadge(
                      selectedEnquiry.status
                    )}`}
                  >
                    {selectedEnquiry.status}
                  </span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-white uppercase tracking-tight">
                  {selectedEnquiry.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block mb-1 text-[10px] uppercase">EMAIL</span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="text-[#d4ff00] hover:underline break-all"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 text-[10px] uppercase">COMPANY</span>
                <span className="text-white">{selectedEnquiry.company || "None"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 text-[10px] uppercase">PROJECT TYPE</span>
                <span className="text-white font-semibold">{selectedEnquiry.projectType}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 text-[10px] uppercase">TIMELINE</span>
                <span className="text-zinc-300">{selectedEnquiry.timeline || "Flexible"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 text-[10px] uppercase">BUDGET</span>
                <span className="text-[#d4ff00] font-bold">{selectedEnquiry.budget || "Unspecified"}</span>
              </div>
              {selectedEnquiry.referenceUrl && (
                <div>
                  <span className="text-zinc-500 block mb-1 text-[10px] uppercase">REFERENCE URL</span>
                  <a
                    href={selectedEnquiry.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#d4ff00] hover:underline flex items-center gap-1"
                  >
                    Open Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2 font-bold">
                PROJECT BRIEF / SPECIFICATIONS
              </h3>
              <div className="p-4 rounded-xl bg-[#090a0d] border border-white/10 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-normal">
                {selectedEnquiry.description}
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2 font-bold flex items-center justify-between">
                <span>ATTACHED REFERENCE FILES ({selectedEnquiry.attachments.length})</span>
                <span className="text-[10px] text-zinc-500 font-normal">Private & Secure</span>
              </h3>

              {selectedEnquiry.attachments.length === 0 ? (
                <div className="p-3 rounded-lg bg-black/30 text-zinc-500 text-xs font-mono">
                  No files attached with this enquiry.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedEnquiry.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileIcon className="w-4 h-4 text-[#d4ff00] shrink-0" />
                        <span className="font-semibold text-white truncate">{att.originalName}</span>
                        <span className="text-zinc-500 font-mono text-[10px] shrink-0">
                          ({(att.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <a
                        href={`/api/admin/attachments/${att.id}`}
                        download={att.originalName}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#d4ff00]/10 hover:bg-[#d4ff00]/20 text-[#d4ff00] font-mono text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        DOWNLOAD
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Manager & Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 uppercase">UPDATE STATUS:</span>
                <select
                  value={selectedEnquiry.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-[#d4ff00] cursor-pointer"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                  <option value="SPAM">SPAM</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
