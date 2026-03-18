"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

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

  const getStatus = (type: string) =>
    integrationStatus?.find((s) => s.type === type);

  if (projectsLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground text-sm">
            Connect your tools to start syncing automatically.
          </p>
        </div>
      </div>

      {!projects?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Create a project first to connect integrations.
            </p>
            <Button asChild size="sm">
              <a href="/dashboard/projects/new">Create project</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Showing for:</span>
            <Select
              value={activeProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-56">
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

          <div className="grid gap-4 sm:grid-cols-2">
            {INTEGRATIONS.map((integration) => {
              const status = getStatus(integration.type);
              const isConnected = status?.connected ?? false;
              const Icon = integration.icon;

              return (
                <Card key={integration.type}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg border bg-muted">
                          <Icon className="size-4" />
                        </div>
                        <CardTitle className="text-base">{integration.label}</CardTitle>
                      </div>
                      {statusLoading ? (
                        <Skeleton className="h-5 w-20" />
                      ) : isConnected ? (
                        <Badge variant="default" className="gap-1 text-xs">
                          <CheckCircle2 className="size-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Not connected
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs leading-relaxed">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="flex items-center justify-between pt-4">
                    <span className="text-xs text-muted-foreground">
                      {isConnected && status?.connectedAt
                        ? `Connected ${formatDistanceToNow(new Date(status.connectedAt), { addSuffix: true })}`
                        : `Requires: ${integration.scopes}`}
                    </span>
                    {isConnected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={disconnect.isPending}
                        onClick={() =>
                          disconnect.mutate({
                            projectId: activeProjectId!,
                            type: integration.type,
                          })
                        }
                      >
                        {disconnect.isPending && (
                          <Loader2 className="size-3 animate-spin" data-icon="inline-start" />
                        )}
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration.type)}
                      >
                        <ExternalLink className="size-3" data-icon="inline-start" />
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
