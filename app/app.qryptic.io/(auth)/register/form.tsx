"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/ui/icons/google-icon";
import NextLink from "next/link";
import { appDomain, protocol } from "@/lib/domains";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterFormValues } from "@/lib/validation/users/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { registerUser } from "@/actions/users/register";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<"google" | "form" | null>(null);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading("form");
    const { error, message } = await registerUser(data);
    if (error) {
      setIsLoading(null);
      return toast.error(message);
    }

    // redirect to dashboard
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
        <QrypticLogo className="h-[18px]" />
        <Card className="w-full rounded-xl py-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Get started with Qryptic</CardTitle>
            <CardDescription className="text-center text-[13px]">
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-[320px]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    className="pl-[34px]"
                    placeholder="Email"
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    className="pl-[34px]"
                    placeholder="Password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  className="w-full"
                  disabled={isLoading === "form" || isLoading === "google"}
                >
                  {isLoading === "form" ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
              <div className="my-6 flex items-center space-x-3">
                <Separator className="w-full" />
                <p className="text-xs text-muted-foreground">OR</p>
                <Separator className="w-full" />
              </div>
              <Button
                variant="outline"
                className="w-full space-x-2"
                disabled={isLoading === "form" || isLoading === "google"}
                onClick={async () => {
                  setIsLoading("google");
                  // sign up with google
                  await signIn("google");
                }}
              >
                {isLoading === "google" ? (
                  <LoaderCircle size={14} className="animate-spin" />
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Sign up with Google</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          Already have an account?{" "}
          <NextLink
            className="text-foreground hover:underline"
            href={`${protocol}${appDomain}/login`}
          >
            Login
          </NextLink>
        </p>
      </div>
    </div>
  );
};
