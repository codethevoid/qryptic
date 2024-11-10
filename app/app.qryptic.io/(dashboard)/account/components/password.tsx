"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mutate as mutateGlobal } from "swr";

const schema = z.object({
  password: z
    .string()
    .min(1, { message: "Please enter your current password" })
    .optional()
    .describe("Users current password, they will have to get this right to update their password"),
  newPassword: z
    .string()
    .min(1, { message: "Please enter a password" })
    .min(8, { message: "Password must be at least 8 characters" })
    .describe("This will be the users new password"),
});

type FormValues = z.infer<typeof schema>;

export const Password = () => {
  const { data: user, mutate } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/update/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      await Promise.allSettled([mutate(), mutateGlobal("/api/me")]);
      setIsLoading(false);
      toast.success("Your password has been set");
      reset();
      setValue("password", "");
      setValue("newPassword", "");
    } catch (e) {
      setIsLoading(false);
      console.error("Error updating password: ", e);
      toast.error("Error updating password");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your password</CardTitle>
          <CardDescription className="text-[13px]">
            {user?.hasPassword
              ? "You can update your password here"
              : "Set a password to login with email and password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {user?.hasPassword && (
            <div className="w-full space-y-1.5">
              <Label htmlFor="password">Current password</Label>
              <Input
                id="password"
                placeholder="Current password"
                className="w-full"
                {...register("password")}
                type="password"
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
          )}
          <div className="w-full space-y-1.5">
            <Label htmlFor="new-password">
              {user?.hasPassword ? "New password" : "Create a password"}
            </Label>
            <Input
              id="new-password"
              placeholder="Password"
              className="w-full"
              {...register("newPassword")}
              type="password"
            />
            {errors.newPassword && (
              <p className="text-xs text-red-600">{errors.newPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">
            {user?.hasPassword ? "Update your password" : "Create a password"}
          </p>
          <Button
            size="sm"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="w-[55px]"
          >
            {isLoading ? <ButtonSpinner /> : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
