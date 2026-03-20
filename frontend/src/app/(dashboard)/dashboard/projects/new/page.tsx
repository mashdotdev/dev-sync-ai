"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      onError: () => toast.error("Failed to create project"),
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">New Project</h1>
        <p className="text-sm text-white/50 mt-1">
          Create a project to start syncing your tools.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-[#0d0d1a] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Project Details</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Give your project a name and an optional description.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm text-white/70">
              Project name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Client App v2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createProject.isPending}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-[#6366f1]/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm text-white/70">
              Description{" "}
              <span className="text-white/30">(optional)</span>
            </Label>
            <Input
              id="description"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createProject.isPending}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-[#6366f1]/50"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={createProject.isPending}
              className="flex-1 text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08] rounded-lg px-4 py-2.5 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || createProject.isPending}
              className="flex-1 bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-colors lp-glow-btn disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {createProject.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
