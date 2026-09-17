import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Inbox, FolderKanban, Sparkles, Clock } from "lucide-react";

export default async function AdminDashboardOverview() {
  const [newEnquiriesCount, totalEnquiriesCount, projectsCount, servicesCount, recentEnquiries] =
    await Promise.all([
      prisma.projectEnquiry.count({ where: { status: "NEW" } }),
      prisma.projectEnquiry.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.service.count({ where: { published: true } }),
      prisma.projectEnquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { attachments: true },
      }),
    ]);

  const stats = [
    {
      title: "NEW ENQUIRIES",
      value: newEnquiriesCount,
      desc: "Awaiting studio review",
      icon: Inbox,
      highlight: newEnquiriesCount > 0,
    },
    {
      title: "TOTAL BRIEFS",
      value: totalEnquiriesCount,
      desc: "All-time enquiries",
      icon: Clock,
      highlight: false,
    },
    {
      title: "PUBLISHED PROJECTS",
      value: projectsCount,
      desc: "Active case studies",
      icon: FolderKanban,
      highlight: false,
    },
    {
      title: "ACTIVE SERVICES",
      value: servicesCount,
      desc: "Production capabilities",
      icon: Sparkles,
      highlight: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-widest mb-1">
            DASHBOARD OVERVIEW
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
            STUDIO CONTROL CENTER
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 rounded-lg bg-[#d4ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#bcf000] transition-colors flex items-center gap-1.5"
          >
            <Inbox className="w-4 h-4" />
            VIEW ENQUIRIES ({newEnquiriesCount})
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className={`p-6 rounded-xl bg-[#11141a] border transition-all ${
                s.highlight
                  ? "border-[#d4ff00]/40 shadow-[0_0_20px_rgba(212,255,0,0.15)]"
                  : "border-white/8"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                  {s.title}
                </span>
                <Icon className={`w-4 h-4 ${s.highlight ? "text-[#d4ff00]" : "text-zinc-400"}`} />
              </div>
              <div className="font-display font-black text-3xl sm:text-4xl text-white mb-1">
                {s.value}
              </div>
              <p className="text-xs text-zinc-400 font-normal">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries Section */}
      <div className="p-6 rounded-2xl bg-[#11141a] border border-white/8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-white">
              RECENT CLIENT ENQUIRIES
            </h2>
            <p className="text-xs text-zinc-400">
              Latest incoming project briefs submitted from the website
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-mono font-semibold text-[#d4ff00] hover:underline flex items-center gap-1"
          >
            ALL ENQUIRIES ↗
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono">
            No project enquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-white/5">
                  <th className="pb-3 pr-4 font-semibold">CLIENT</th>
                  <th className="pb-3 px-4 font-semibold">PROJECT TYPE</th>
                  <th className="pb-3 px-4 font-semibold">TIMELINE & BUDGET</th>
                  <th className="pb-3 px-4 font-semibold">FILES</th>
                  <th className="pb-3 px-4 font-semibold">STATUS</th>
                  <th className="pb-3 pl-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-white">{enq.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{enq.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <div>{enq.projectType}</div>
                      {enq.company && (
                        <div className="text-[10px] text-zinc-500 font-mono">{enq.company}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      <div>{enq.timeline || "Flexible"}</div>
                      <div className="text-[#d4ff00]">{enq.budget || "$1000 - $3000"}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                      {enq.attachments.length > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#d4ff00]">
                          {enq.attachments.length} file(s)
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                          enq.status === "NEW"
                            ? "bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/30"
                            : enq.status === "CONTACTED"
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : enq.status === "IN_PROGRESS"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : enq.status === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <Link
                        href={`/admin/enquiries?id=${enq.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-300 hover:text-[#d4ff00]"
                      >
                        VIEW ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
