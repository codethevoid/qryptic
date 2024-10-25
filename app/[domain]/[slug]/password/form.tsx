"use client";

import { useParams } from "next/navigation";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { CardDescription, CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { verifyPassword } from "@/app/[domain]/[slug]/password/action";
import { useRouter } from "next/navigation";

const passwordSchema = z.object({
  password: z.string().min(1, "Please enter a password"),
});

type PasswordValues = z.infer<typeof passwordSchema>;

export const PasswordForm = () => {
  const { slug, domain } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (data: PasswordValues) => {
    const { password } = data;
    setIsLoading(true);
    const { error, url } = await verifyPassword(slug as string, domain as string, password);
    if (error) {
      setIsLoading(false);
      return toast.error(error);
    }

    // redirect to the updated URL with password in query
    // this will be handled by the middleware
    router.push(url as string);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
        <QrypticLogo className="h-[18px]" />
        <Card className="w-full rounded-xl py-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Password protected link</CardTitle>
            <CardDescription className="text-center text-[13px]">
              Please enter the password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[320px] space-y-4">
              <div className="space-y-1.5">
                <Input placeholder="Password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? <ButtonSpinner /> : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
