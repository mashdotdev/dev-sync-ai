"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GitBranch,
  FileText,
  MessageSquare,
  LayoutList,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const INTEGRATIONS = [
  {
    type: "github" as const,
    label: "GitHub",
    description:
      "Read commits and diffs when code is pushed. Automatically detect which tickets are addressed by each commit.",
    icon: GitBranch,
    scopes: "Repository contents, webhooks",
  },
  {
    type: "notion" as const,
    label: "Notion",
    description:
      "Read ticket requirements and update ticket statuses in your Notion databases.",
    icon: FileText,
    scopes: "Read/write pages and databases",
  },
  {
    type: "slack" as const,
    label: "Slack",
    description:
      "Post human-readable progress updates to a project channel automatically after each sync.",
    icon: MessageSquare,
    scopes: "chat:write, channels:read",
  },
  {
    type: "linear" as const,
    label: "Linear",
    description:
      "Read and update Linear issues. Keep your engineering tracker in sync with real code progress.",
    icon: LayoutList,
    scopes: "issues:read, issues:write",
  },
];

function NotionDatabaseInput({
  projectId,
  currentDatabaseId,
}: {
  projectId: string;
  currentDatabaseId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [databaseId, setDatabaseId] = useState(currentDatabaseId);

  const save = useMutation(
    trpc.integrations.updateMetadata.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["integrations", "getStatus"]] });
        toast.success("Database ID saved");
      },
      onError: () => toast.error("Failed to save database ID"),
    })
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
        <AlertCircle className="size-3.5" />
        Database ID not set — sync won&apos;t read tickets
      </div>
      <p className="text-xs text-white/40">
        Open your Notion database → copy the URL → paste the 32-char ID before{" "}
        <span className="font-mono text-white/60">?v=</span>
      </p>
      <div className="flex gap-2">
        <Input
          className="h-7 font-mono text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          placeholder="328ece010d3c80b5b784cf10f7caf5da"
          value={databaseId}
          onChange={(e) => setDatabaseId(e.target.value.trim())}
        />
        <Button
          size="sm"
          className="h-7 text-xs bg-[#6366f1] hover:bg-[#6366f1]/90 text-white"
          disabled={!databaseId || save.isPending}
          onClick={() =>
            save.mutate({ projectId, type: "notion", metadata: { databaseId } })
          }
        >
          {save.isPending ? <Loader2 className="size-3 animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

function GitHubRepoInput({
  projectId,
  owner,
  currentRepo,
}: {
  projectId: string;
  owner: string;
  currentRepo: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [repo, setRepo] = useState(currentRepo);

  const save = useMutation(
    trpc.integrations.updateMetadata.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [["integrations", "getStatus"]] });
        toast.success("Repository saved");
      },
      onError: () => toast.error("Failed to save repository"),
    })
  );

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
        <AlertCircle className="size-3.5" />
        Repository not set — sync won&apos;t run
      </div>
      <p className="text-xs text-white/40">
        Enter the repo name to watch (connected as{" "}
        <span className="font-mono font-medium text-white/60">{owner}</span>)
      </p>
      <div className="flex gap-2">
        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white/40">
          {owner}/
        </div>
        <Input
          className="h-7 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
          placeholder="repo-name"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <Button
          size="sm"
          className="h-7 text-xs bg-[#6366f1] hover:bg-[#6366f1]/90 text-white"
          disabled={!repo.trim() || save.isPending}
          onClick={() =>
            save.mutate({ projectId, type: "github", metadata: { owner, repo: repo.trim() } })
          }
        >
          {save.isPending ? <Loader2 className="size-3 animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: projects, isLoading: projectsLoading } = useQuery(
    trpc.projects.list.queryOptions()
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const activeProjectId = selectedProjectId || projects?.[0]?.id;

  const { data: integrationStatus, isLoading: statusLoading } = useQuery({
    ...trpc.integrations.getStatus.queryOptions({ projectId: activeProjectId ?? "" }),
    enabled: !!activeProjectId,
  });

  const disconnect = useMutation(
    trpc.integrations.disconnect.mutationOptions({
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({ queryKey: [["integrations", "getStatus"]] });
        queryClient.invalidateQueries({ queryKey: [["projects", "list"]] });
        toast.success(`${vars.type} disconnected`);
      },
      onError: () => toast.error("Failed to disconnect"),
    })
  );

  const handleConnect = (type: string) => {
    if (!activeProjectId) {
      toast.error("Select a project first");
      return;
    }
    window.location.href = `/api/integrations/${type}?projectId=${activeProjectId}`;
  };

  const getStatus = (type: string) => integrationStatus?.find((s) => s.type === type);

  if (projectsLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48 bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Integrations</h1>
        <p className="text-sm text-white/50 mt-1">
          Connect your tools to start syncing automatically.
        </p>
      </div>

      {!projects?.length ? (
        <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-white/50">
            Create a project first to connect integrations.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
          >
            <Plus className="size-4" />
            Create project
          </Link>
        </div>
      ) : (
        <>
          {/* Project selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40 shrink-0">Showing for:</span>
            <Select value={activeProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-56 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Integration cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {INTEGRATIONS.map((integration) => {
              const status = getStatus(integration.type);
              const isConnected = status?.connected ?? false;
              const Icon = integration.icon;
              const meta = status?.metadata ?? {};

              const needsRepo =
                integration.type === "github" && isConnected && !meta.repo;
              const needsNotionDb =
                integration.type === "notion" && isConnected && !meta.databaseId;

              return (
                <div
                  key={integration.type}
                  className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden hover:border-white/[0.12] transition-colors"
                >
                  {/* Card header */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Icon className="size-4 text-white/60" />
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {integration.label}
                        </span>
                      </div>
                      {statusLoading ? (
                        <Skeleton className="h-5 w-20 bg-white/5" />
                      ) : isConnected ? (
                        <div className="flex items-center gap-1.5 text-xs text-green-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                          Connected
                        </div>
                      ) : (
                        <span className="text-xs text-white/30 border border-white/10 px-1.5 py-0.5 rounded-sm">
                          Not connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {integration.description}
                    </p>
                  </div>

                  {/* Extra inputs */}
                  {needsRepo && activeProjectId && (
                    <div className="px-5 pb-4">
                      <GitHubRepoInput
                        projectId={activeProjectId}
                        owner={meta.owner ?? ""}
                        currentRepo={meta.repo ?? ""}
                      />
                    </div>
                  )}
                  {isConnected && meta.repo && integration.type === "github" && (
                    <div className="px-5 pb-3">
                      <p className="text-xs text-white/40">
                        Watching:{" "}
                        <span className="font-mono text-white/60">
                          {meta.owner}/{meta.repo}
                        </span>
                      </p>
                    </div>
                  )}
                  {needsNotionDb && activeProjectId && (
                    <div className="px-5 pb-4">
                      <NotionDatabaseInput
                        projectId={activeProjectId}
                        currentDatabaseId={meta.databaseId ?? ""}
                      />
                    </div>
                  )}
                  {isConnected && meta.databaseId && integration.type === "notion" && (
                    <div className="px-5 pb-3">
                      <p className="text-xs text-white/40">
                        Database:{" "}
                        <span className="font-mono text-white/60">{meta.databaseId}</span>
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                    <span className="text-xs text-white/30">
                      {isConnected && status?.connectedAt
                        ? `Connected ${formatDistanceToNow(new Date(status.connectedAt), { addSuffix: true })}`
                        : `Requires: ${integration.scopes}`}
                    </span>
                    {isConnected ? (
                      <button
                        className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                        disabled={disconnect.isPending}
                        onClick={() =>
                          disconnect.mutate({
                            projectId: activeProjectId!,
                            type: integration.type,
                          })
                        }
                      >
                        {disconnect.isPending && (
                          <Loader2 className="size-3 animate-spin inline mr-1" />
                        )}
                        Disconnect
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-1.5 text-xs text-[#6366f1] hover:text-[#6366f1]/80 transition-colors font-medium"
                        onClick={() => handleConnect(integration.type)}
                      >
                        <ExternalLink className="size-3" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
