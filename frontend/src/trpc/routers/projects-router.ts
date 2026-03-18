import db from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { createTRPCRouter, protectedProcedure } from "../init";

export const projectsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.project.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        integrations: { select: { type: true } },
        _count: { select: { syncEvents: true } },
      },
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await db.project.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          integrations: { select: { type: true, createdAt: true } },
          syncEvents: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
          reports: {
            orderBy: { generatedAt: "desc" },
          },
        },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return project;
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return db.project.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          description: input.description,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(["active", "paused", "archived"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const project = await db.project.findFirst({
        where: { id, userId: ctx.session.user.id },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      return db.project.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await db.project.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      await db.project.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
