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
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { toast } from "sonner";
import { mutate as mutateGlobal } from "swr";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

type FormValues = z.infer<typeof schema>;

export const UserEmail = () => {
  const { data: user, mutate } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/update/email`, {
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
      toast.success("Your email has been updated");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Error updating email");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your email</CardTitle>
          <CardDescription className="text-[13px]">
            This is the email used to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="email">Your email</Label>
            <Input
              defaultValue={user?.email || ""}
              id="email"
              type="email"
              placeholder="Your email"
              className="max-w-[400px]"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">Max 50 characters</p>
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
