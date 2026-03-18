"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  GitBranch,
  Clock,
  FileText,
  Plug,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
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
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
              className="capitalize"
            >
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground text-sm">{project.description}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive shrink-0"
          onClick={() => {
            if (confirm("Delete this project? This cannot be undone.")) {
              deleteProject.mutate({ id });
            }
          }}
          disabled={deleteProject.isPending}
        >
          {deleteProject.isPending ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <Trash2 className="size-4" data-icon="inline-start" />
          )}
          Delete
        </Button>
      </div>

      {/* Connected Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected Tools</CardTitle>
          <CardDescription>
            Integration status for this project.{" "}
            <Link href="/dashboard/integrations" className="underline underline-offset-4">
              Manage integrations →
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(integrationStatus ?? []).map((integration) => {
              const Icon = INTEGRATION_ICONS[integration.type] ?? Plug;
              return (
                <div
                  key={integration.type}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Icon className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium capitalize">{integration.type}</span>
                    {integration.connected && integration.connectedAt ? (
                      <span className="text-xs text-muted-foreground truncate">
                        Connected {formatDistanceToNow(new Date(integration.connectedAt), { addSuffix: true })}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not connected</span>
                    )}
                  </div>
                  {integration.connected ? (
                    <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="size-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sync Events Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sync Activity</CardTitle>
            <CardDescription>Recent sync events for this project</CardDescription>
          </CardHeader>
          <CardContent>
            {!project.syncEvents.length ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <GitBranch className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No sync events yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {project.syncEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm">
                        {eventTypeLabel[event.type] ?? event.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reports</CardTitle>
            <CardDescription>Generated weekly reports</CardDescription>
          </CardHeader>
          <CardContent>
            {!project.reports.length ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <FileText className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No reports generated yet.</p>
                <p className="text-xs text-muted-foreground">
                  Reports are generated automatically after each sync week.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {project.reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="text-sm">
                        Week of {format(new Date(report.generatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/reports?id=${report.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
