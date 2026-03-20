"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const statusStyle: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  paused: "bg-white/5 text-white/40 border-white/10",
  archived: "bg-white/5 text-white/30 border-white/10",
};

export default function ProjectsPage() {
  const trpc = useTRPC();
  const { data: projects, isLoading } = useQuery(trpc.projects.list.queryOptions());

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Projects</h1>
          <p className="text-sm text-white/50 mt-1">Manage your synced projects.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors lp-glow-btn"
        >
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : !projects?.length ? (
        <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
            <FolderKanban className="size-6 text-[#6366f1]" />
          </div>
          <div>
            <p className="font-semibold text-white">No projects yet</p>
            <p className="text-sm text-white/50 mt-1">
              Create your first project to start syncing your tools.
            </p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
          >
            <Plus className="size-4" />
            Create project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <div className="h-full rounded-xl border border-white/[0.07] bg-[#0d0d1a] p-5 hover:border-[#6366f1]/30 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col gap-4">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center shrink-0">
                      <FolderKanban className="size-4 text-[#6366f1]" />
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">{project.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-sm border shrink-0 ${statusStyle[project.status] ?? "bg-white/5 text-white/40 border-white/10"}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Integration badges */}
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {project.integrations.length > 0 ? (
                    project.integrations.map((i) => (
                      <span
                        key={i.type}
                        className="text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-sm bg-white/5 text-white/40 border border-white/10"
                      >
                        {i.type}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/30">No integrations connected</span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-white/30 pt-1 border-t border-white/5">
                  <span>{project._count.syncEvents} syncs</span>
                  <span className="flex items-center gap-1">
                    Created{" "}
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
