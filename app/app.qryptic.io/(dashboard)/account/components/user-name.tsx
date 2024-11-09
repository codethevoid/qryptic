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
import { useForm } from "react-hook-form";
import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mutate as mutateGlobal } from "swr";

const schema = z.object({
  name: z.string().max(50, { message: "Your name must be less than 50 characters" }).optional(),
});

type FormValues = z.infer<typeof schema>;

export const UserName = () => {
  const { data: user, mutate } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { name } = values;
      const res = await fetch("/api/user/update/name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      await Promise.allSettled([mutate(), mutateGlobal("/api/me")]);
      setIsLoading(false);
      toast.success("Your name has been updated");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Error updating your name");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your name</CardTitle>
          <CardDescription className="text-[13px]">
            People will see your name when collaborating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input
              defaultValue={user?.name || ""}
              id="name"
              placeholder="Your name"
              className="max-w-[400px]"
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
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
