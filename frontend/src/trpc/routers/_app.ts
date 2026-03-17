import { createTRPCRouter } from "../init";
import { userRouter } from "./user-router";
export const appRouter = createTRPCRouter({
  user: userRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
