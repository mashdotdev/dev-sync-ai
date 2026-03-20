"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function ReportsPage() {
  const trpc = useTRPC();
  const { data: reports, isLoading } = useQuery(trpc.reports.list.queryOptions({}));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Reports</h1>
        <p className="text-sm text-white/50 mt-1">
          AI-generated weekly reports across all your projects.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : !reports?.length ? (
        <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
            <FileText className="size-6 text-[#6366f1]" />
          </div>
          <div>
            <p className="font-semibold text-white">No reports yet</p>
            <p className="text-sm text-white/50 mt-1">
              Reports are generated automatically after weekly syncs.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Weekly Report — {format(new Date(report.generatedAt), "MMMM d, yyyy")}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-sm bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20">
                        {report.project.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  disabled
                  className="flex items-center gap-1.5 text-xs text-white/30 border border-white/10 rounded-lg px-3 py-1.5 disabled:opacity-40 cursor-not-allowed"
                >
                  <Download className="size-3" />
                  Download PDF
                </button>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-white/50 line-clamp-3 whitespace-pre-line leading-relaxed">
                  {report.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
