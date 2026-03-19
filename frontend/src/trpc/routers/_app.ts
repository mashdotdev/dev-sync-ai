import { createTRPCRouter } from "../init";
import { agentRouter } from "./agent-router";
import { integrationsRouter } from "./integrations-router";
import { projectsRouter } from "./projects-router";
import { reportsRouter } from "./reports-router";
import { syncEventsRouter } from "./sync-events-router";
import { userRouter } from "./user-router";

export const appRouter = createTRPCRouter({
  user: userRouter,
  projects: projectsRouter,
  integrations: integrationsRouter,
  syncEvents: syncEventsRouter,
  reports: reportsRouter,
  agent: agentRouter,
});

export type AppRouter = typeof appRouter;
