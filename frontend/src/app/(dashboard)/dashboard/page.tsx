"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Plug, RefreshCcw, Plus, GitBranch, Clock, Wand2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  accent?: boolean;
}) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/50 font-medium">{label}</p>
        <Icon className="size-4 text-white/20" />
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 bg-white/5" />
      ) : (
        <p className={`text-3xl font-semibold tracking-tight ${accent ? "text-[#22d3ee]" : "text-white"}`}>
          {value}
        </p>
      )}
    </div>
  );
}

const eventTypeLabel: Record<string, string> = {
  push: "GitHub push synced",
  scheduled: "Scheduled sync",
  manual: "Manual sync",
};

export default function DashboardPage() {
  const trpc = useTRPC();

  const { data: projects, isLoading: projectsLoading } = useQuery(
    trpc.projects.list.queryOptions()
  );

  const { data: syncEventsData, isLoading: eventsLoading } = useQuery(
    trpc.syncEvents.list.queryOptions({ limit: 10 })
  );

  const activeProjects = projects?.filter((p) => p.status === "active").length ?? 0;
  const connectedIntegrations =
    projects?.reduce((sum, p) => sum + p.integrations.length, 0) ?? 0;
  const totalSyncs = projects?.reduce((sum, p) => sum + p._count.syncEvents, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Overview</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="text-sm text-white/50">Your project sync status at a glance.</p>
          </div>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors lp-glow-btn"
        >
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon={FolderKanban}
          loading={projectsLoading}
        />
        <StatCard
          label="Connected Integrations"
          value={connectedIntegrations}
          icon={Plug}
          loading={projectsLoading}
        />
        <StatCard
          label="Total Syncs"
          value={totalSyncs}
          icon={RefreshCcw}
          loading={projectsLoading}
          accent
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
            <p className="text-xs text-white/40 mt-0.5">Latest sync events across all your projects</p>
          </div>
          <Wand2 className="size-4 text-white/20" />
        </div>
        <div className="px-4 py-2">
          {eventsLoading ? (
            <div className="flex flex-col gap-2 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-white/5 rounded-lg" />
              ))}
            </div>
          ) : !syncEventsData?.items.length ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <GitBranch className="size-5 text-white/30" />
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium">No sync events yet</p>
                <p className="text-xs text-white/30 mt-1">
                  Connect your tools and trigger a sync to see activity here.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {syncEventsData.items.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-white/80 font-medium">
                        {eventTypeLabel[event.type] ?? event.type}
                      </span>
                      <span className="text-xs text-white/40">{event.project.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/30">
                    <Clock className="size-3" />
                    {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects quick access */}
      {projects && projects.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-sm font-semibold text-white">Your Projects</h2>
              <p className="text-xs text-white/40 mt-0.5">Quick access to all projects</p>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs text-[#6366f1] hover:text-[#6366f1]/80 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="px-4 py-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center shrink-0">
                    <FolderKanban className="size-3.5 text-[#6366f1]" />
                  </div>
                  <span className="text-sm text-white/80 font-medium">{project.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {project.integrations.map((i) => (
                    <span
                      key={i.type}
                      className="text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-sm bg-white/5 text-white/40 border border-white/10"
                    >
                      {i.type}
                    </span>
                  ))}
                  <span
                    className={`text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-sm border ${
                      project.status === "active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-white/5 text-white/40 border-white/10"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
