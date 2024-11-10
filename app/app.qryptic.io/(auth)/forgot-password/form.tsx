"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Please enter your email" }),
});

type FormValues = z.infer<typeof schema>;

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { email } = values;
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      setIsLoading(false);
      toast.success("Reset email sent", {
        description:
          "If an account exists with this email, you will receive a reset link in your inbox.",
      });
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to send reset email");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
        <QrypticLogo className="h-[18px]" />
        <Card className="w-full rounded-xl py-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Forgot password</CardTitle>
            <CardDescription className="text-center text-[13px]">
              We will send a reset link to your email
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

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? <ButtonSpinner /> : "Send reset email"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
