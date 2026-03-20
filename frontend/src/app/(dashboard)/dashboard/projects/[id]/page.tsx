"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GitBranch,
  Clock,
  FileText,
  Plug,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

const INTEGRATION_ICONS: Record<string, React.ElementType> = {
  github: GitBranch,
  notion: FileText,
  slack: Plug,
  linear: Plug,
};

const eventTypeLabel: Record<string, string> = {
  push: "GitHub push synced",
  scheduled: "Scheduled sync",
  manual: "Manual sync",
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery(
    trpc.projects.get.queryOptions({ id })
  );

  const { data: integrationStatus } = useQuery(
    trpc.integrations.getStatus.queryOptions({ projectId: id })
  );

  const deleteProject = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["projects", "list"]] });
        toast.success("Project deleted");
        router.push("/dashboard/projects");
      },
      onError: () => toast.error("Failed to delete project"),
    })
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-20 rounded-xl bg-white/5" />
          <Skeleton className="h-20 rounded-xl bg-white/5" />
          <Skeleton className="h-20 rounded-xl bg-white/5" />
        </div>
        <Skeleton className="h-64 rounded-xl bg-white/5" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-white/50">Project not found.</p>
        <Link
          href="/dashboard/projects"
          className="text-sm text-[#6366f1] hover:text-[#6366f1]/80 transition-colors"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {project.name}
            </h1>
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
          {project.description && (
            <p className="text-sm text-white/50">{project.description}</p>
          )}
        </div>
        <button
          className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 rounded-lg px-3 py-2 transition-colors disabled:opacity-40 shrink-0"
          onClick={() => {
            if (confirm("Delete this project? This cannot be undone.")) {
              deleteProject.mutate({ id });
            }
          }}
          disabled={deleteProject.isPending}
        >
          {deleteProject.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
          Delete
        </button>
      </div>

      {/* Connected Tools */}
      <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-sm font-semibold text-white">Connected Tools</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Integration status for this project.{" "}
              <Link
                href="/dashboard/integrations"
                className="text-[#6366f1] hover:text-[#6366f1]/80 transition-colors"
              >
                Manage →
              </Link>
            </p>
          </div>
          <LinkIcon className="size-4 text-white/20" />
        </div>
        <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(integrationStatus ?? []).map((integration) => {
            const Icon = INTEGRATION_ICONS[integration.type] ?? Plug;
            return (
              <div
                key={integration.type}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="size-3.5 text-white/40" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium capitalize text-white/80">
                    {integration.type}
                  </span>
                  {integration.connected && integration.connectedAt ? (
                    <span className="text-[10px] text-white/30 truncate">
                      {formatDistanceToNow(new Date(integration.connectedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/30">Not connected</span>
                  )}
                </div>
                {integration.connected ? (
                  <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-white/20 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Activity + Reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sync Activity */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Sync Activity</h2>
            <p className="text-xs text-white/40 mt-0.5">Recent sync events for this project</p>
          </div>
          <div className="px-4 py-2">
            {!project.syncEvents.length ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <GitBranch className="size-4 text-white/30" />
                </div>
                <p className="text-sm text-white/40">No sync events yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {project.syncEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shrink-0" />
                      <span className="text-sm text-white/70">
                        {eventTypeLabel[event.type] ?? event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/30 shrink-0">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(event.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reports */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Reports</h2>
            <p className="text-xs text-white/40 mt-0.5">Generated weekly reports</p>
          </div>
          <div className="px-4 py-2">
            {!project.reports.length ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <FileText className="size-4 text-white/30" />
                </div>
                <div>
                  <p className="text-sm text-white/40">No reports generated yet.</p>
                  <p className="text-xs text-white/25 mt-0.5">
                    Generated automatically after each sync week.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {project.reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-white/30 shrink-0" />
                      <span className="text-sm text-white/70">
                        Week of{" "}
                        {format(new Date(report.generatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/reports?id=${report.id}`}
                      className="text-xs text-[#6366f1] hover:text-[#6366f1]/80 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
