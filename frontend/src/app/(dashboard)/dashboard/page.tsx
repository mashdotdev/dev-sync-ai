"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plug, RefreshCcw, Plus, GitBranch, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
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
  const connectedIntegrations = projects?.reduce(
    (sum, p) => sum + p.integrations.length,
    0
  ) ?? 0;
  const totalSyncs = projects?.reduce((sum, p) => sum + p._count.syncEvents, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">
            Your project sync status at a glance.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/projects/new">
            <Plus data-icon="inline-start" />
            New project
          </Link>
        </Button>
      </div>

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
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>Latest sync events across all your projects</CardDescription>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !syncEventsData?.items.length ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <GitBranch className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No sync events yet.</p>
              <p className="text-xs text-muted-foreground">
                Connect your tools and trigger a sync to see activity here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {syncEventsData.items.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {eventTypeLabel[event.type] ?? event.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{event.project.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {projects && projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Projects</CardTitle>
            <CardDescription>Quick access to all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.integrations.map((i) => (
                      <Badge key={i.type} variant="secondary" className="text-xs capitalize">
                        {i.type}
                      </Badge>
                    ))}
                    <Badge
                      variant={project.status === "active" ? "default" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {project.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
