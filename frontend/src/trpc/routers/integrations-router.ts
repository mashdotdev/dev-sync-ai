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
        select: { type: true, createdAt: true },
      });

      return INTEGRATION_TYPES.map((type) => ({
        type,
        connected: integrations.some((i) => i.type === type),
        connectedAt: integrations.find((i) => i.type === type)?.createdAt ?? null,
      }));
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
