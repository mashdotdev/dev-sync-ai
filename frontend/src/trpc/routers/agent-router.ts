import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const agentRouter = createTRPCRouter({
  triggerSync: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        triggerType: z.enum(["manual", "scheduled"]).default("manual"),
      })
    )
    .mutation(async ({ input }) => {
      const res = await fetch(`${BACKEND_URL}/sync/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: input.projectId,
          trigger_type: input.triggerType,
        }),
      });
      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }
      return res.json();
    }),

  generateReport: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        days: z.number().int().min(1).max(90).default(7),
      })
    )
    .mutation(async ({ input }) => {
      const res = await fetch(`${BACKEND_URL}/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: input.projectId,
          days: input.days,
        }),
      });
      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }
      return res.json();
    }),
});
