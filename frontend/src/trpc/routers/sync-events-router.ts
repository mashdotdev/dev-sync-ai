import db from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../init";

export const syncEventsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
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

      const items = await db.syncEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { project: { select: { name: true } } },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        nextCursor = items.pop()!.id;
      }

      return { items, nextCursor };
    }),
});
