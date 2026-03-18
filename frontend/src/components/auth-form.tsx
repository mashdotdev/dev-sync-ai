"use client";

import {
  useForm,
  Controller,
  FieldValues,
  DefaultValues,
  Path,
} from "react-hook-form";
import z, { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { FIELD_TYPES, FORM_LABEL, INPUT_PLACEHOLDER } from "@/constants";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/utils/auth-client";

interface AuthFormProps<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T, T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (
    data: T,
  ) => Promise<{ success: boolean; message: string; redirect?: string }>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const router = useRouter();

  const handleFormSubmit = async (data: z.infer<typeof schema>) => {
    const result = await onSubmit(data);
    if (result.success) {
      // toast notification later
      router.push(result.redirect as string);
    } else {
      console.log(result.message);
      // toast notification later
    }

    console.log(data);
  };

  return (
    <Card className="w-full md:w-96">
      <CardHeader>
        <CardTitle>{type === "SIGN_IN" ? "Welcome back" : "Sign Up"}</CardTitle>
        <CardDescription>
          {type === "SIGN_IN"
            ? "Sign in to continue syncing your workflow"
            : "Create a new acocunt"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div>
            <FieldGroup>
              {Object.keys(defaultValues).map((item) => (
                <Controller
                  key={item}
                  name={item as Path<T>}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        {FORM_LABEL[item as keyof typeof FORM_LABEL]}
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder={
                          INPUT_PLACEHOLDER[
                            item as keyof typeof INPUT_PLACEHOLDER
                          ]
                        }
                        type={FIELD_TYPES[item as keyof typeof FIELD_TYPES]}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
            </FieldGroup>
          </div>
          <Button className="cursor-pointer w-full bg-brand-primary text-brand-white">
            {type === "SIGN_IN" ? "Sign in" : "Sign up"}
          </Button>
          <p className="text-center text-muted-foreground text-xs">
            OR CONTINUE WITH
          </p>
          <div>
            <Button
              type="button"
              className="cursor-pointer w-full bg-brand-primary text-brand-white"
              onClick={async () => {
                await authClient.signIn.social({ provider: "google" });
              }}
            >
              <FcGoogle />
              Google
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Link href={type === "SIGN_IN" ? "/sign-up" : "sign-in"}>
          {type === "SIGN_IN"
            ? "Don't have an account yet? Create one"
            : "Already have an account? Sign in"}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
