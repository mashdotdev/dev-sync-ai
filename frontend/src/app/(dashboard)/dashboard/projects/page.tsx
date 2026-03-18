"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  archived: "outline",
};

export default function ProjectsPage() {
  const trpc = useTRPC();
  const { data: projects, isLoading } = useQuery(trpc.projects.list.queryOptions());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage your synced projects.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/projects/new">
            <Plus data-icon="inline-start" />
            New project
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : !projects?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FolderKanban className="size-10 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="font-medium">No projects yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first project to start syncing your tools.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/projects/new">
                <Plus data-icon="inline-start" />
                Create project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/30 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{project.name}</CardTitle>
                    <Badge
                      variant={statusVariant[project.status] ?? "secondary"}
                      className="text-xs capitalize shrink-0"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1">
                    {project.integrations.length > 0 ? (
                      project.integrations.map((i) => (
                        <Badge key={i.type} variant="outline" className="text-xs capitalize">
                          {i.type}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No integrations connected</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project._count.syncEvents} syncs</span>
                    <span className="flex items-center gap-1">
                      Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
