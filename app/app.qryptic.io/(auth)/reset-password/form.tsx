"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  password: z
    .string()
    .min(1, { message: "Please enter a password" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof schema>;

export const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    const { password } = values;
    const token = searchParams.get("token");
    try {
      const res = await fetch(`/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      toast.success("Password reset successfully");
      router.push("/login");
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
        <QrypticLogo className="h-[18px]" />
        <Card className="w-full rounded-xl py-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Reset password</CardTitle>
            <CardDescription className="text-center text-[13px]">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-[320px]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? <ButtonSpinner /> : "Reset password"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
