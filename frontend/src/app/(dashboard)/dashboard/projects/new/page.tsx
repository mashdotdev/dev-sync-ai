"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewProjectPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (project) => {
        queryClient.invalidateQueries({ queryKey: [["projects", "list"]] });
        toast.success("Project created");
        router.push(`/dashboard/projects/${project.id}`);
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject.mutate({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
        <p className="text-muted-foreground text-sm">
          Create a project to start syncing your tools.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Details</CardTitle>
          <CardDescription>Give your project a name and an optional description.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                placeholder="e.g. Client App v2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createProject.isPending}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="description"
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createProject.isPending}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createProject.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || createProject.isPending}>
                {createProject.isPending && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
                Create project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
