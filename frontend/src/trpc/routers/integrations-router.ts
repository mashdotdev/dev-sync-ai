import db from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../init";

const INTEGRATION_TYPES = ["github", "notion", "slack", "linear"] as const;

export const integrationsRouter = createTRPCRouter({
  getStatus: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await db.project.findFirst({
        where: { id: input.projectId, userId: ctx.session.user.id },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      const integrations = await db.integration.findMany({
        where: { projectId: input.projectId },
        select: { type: true, createdAt: true, metadata: true },
      });

      return INTEGRATION_TYPES.map((type) => {
        const row = integrations.find((i) => i.type === type);
        let metadata: Record<string, string> = {};
        if (row?.metadata) {
          try { metadata = JSON.parse(row.metadata); } catch {}
        }
        return {
          type,
          connected: !!row,
          connectedAt: row?.createdAt ?? null,
          metadata,
        };
      });
    }),

  updateMetadata: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      type: z.enum(INTEGRATION_TYPES),
      metadata: z.record(z.string(), z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const project = await db.project.findFirst({
        where: { id: input.projectId, userId: ctx.session.user.id },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      await db.integration.update({
        where: { projectId_type: { projectId: input.projectId, type: input.type } },
        data: { metadata: JSON.stringify(input.metadata) },
      });
      return { success: true };
    }),

  disconnect: protectedProcedure
    .input(z.object({ projectId: z.string(), type: z.enum(INTEGRATION_TYPES) }))
    .mutation(async ({ ctx, input }) => {
      const project = await db.project.findFirst({
        where: { id: input.projectId, userId: ctx.session.user.id },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      await db.integration.deleteMany({
        where: { projectId: input.projectId, type: input.type },
      });
      return { success: true };
    }),
});
