import { object, string } from "zod";

export const SignInSchema = object({
  email: string().min(1, { message: "Email is required" }),
  password: string().min(6, { message: "Password must be at least 6 chars" }),
});

export const SignUpSchema = object({
  name: string().min(1, { message: "Name is required" }),
  email: string().min(1, { message: "Email is required" }),
  password: string().min(6, { message: "Password must be at least 6 chars" }),
});
