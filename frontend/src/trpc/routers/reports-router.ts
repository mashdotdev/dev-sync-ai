import db from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../init";

export const reportsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.projectId) {
        const project = await db.project.findFirst({
          where: { id: input.projectId, userId: ctx.session.user.id },
        });
        if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      }

      const where = input.projectId
        ? { projectId: input.projectId }
        : { project: { userId: ctx.session.user.id } };

      return db.report.findMany({
        where,
        orderBy: { generatedAt: "desc" },
        include: { project: { select: { name: true } } },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const report = await db.report.findFirst({
        where: {
          id: input.id,
          project: { userId: ctx.session.user.id },
        },
        include: { project: { select: { name: true } } },
      });
      if (!report) throw new TRPCError({ code: "NOT_FOUND" });
      return report;
    }),
});
