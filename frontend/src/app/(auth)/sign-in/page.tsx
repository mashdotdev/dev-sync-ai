"use client";

import AuthForm from "@/components/auth-form";
import { SignInSchema } from "@/schema/auth-form-schema";
import { authClient } from "@/utils/auth-client";

const SignInPage = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      defaultValues={{
        email: "",
        password: "",
      }}
      schema={SignInSchema}
      onSubmit={async (data) => {
        const { error } = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

        if (error) {
          return { success: false, message: error.message ?? "Sign in failed" };
        }

        return { success: true, message: "Signed in", redirect: "/" };
      }}
    />
  );
};

export default SignInPage;
