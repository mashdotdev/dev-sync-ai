"use client";

import AuthForm from "@/components/auth-form";
import { SignUpSchema } from "@/schema/auth-form-schema";
import { authClient } from "@/utils/auth-client";

const SignUpPage = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
      }}
      onSubmit={async (data) => {
        const { error } = await authClient.signUp.email({
          ...data,
        });

        if (error)
          return { success: false, message: error.message ?? "Sign up failed" };

        return {
          success: true,
          message: "Sign up successful",
          redirect: "/sign-in",
        };
      }}
    />
  );
};

export default SignUpPage;
