import { email, object, string } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import db from "@/utils/prisma";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  createUser: baseProcedure
    .input(
      object({
        name: string(),
        email: email(),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User with this email already exists",
        });
      }

      return await db.user.create({
        data: { name: input.name, email: input.email },
      });
    }),
});
