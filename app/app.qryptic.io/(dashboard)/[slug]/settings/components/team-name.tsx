"use client";

import { useState } from "react";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mutate as mutateGlobal } from "swr";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

const teamNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Team name is required" })
    .max(28, { message: "Team name must no more than 28 characters" }),
});

type FormValues = z.infer<typeof teamNameSchema>;

export const TeamName = () => {
  const { data: team, mutate } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(teamNameSchema),
  });

  const onSubmit = async (values: FormValues) => {
    const { name } = values;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${team?.slug}/update/name`, {
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

      await Promise.allSettled([
        mutate(),
        mutateGlobal(`/api/teams/${team?.slug}`),
        mutateGlobal("/api/teams"),
      ]);
      setIsLoading(false);
      toast.success("Team name has been updated");
    } catch (e) {
      setIsLoading(false);
      toast.error("Error updating team name");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Team name</CardTitle>
          <CardDescription className="text-[13px]">
            You can update your team name here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              defaultValue={team?.name}
              id="team-name"
              placeholder="Team name"
              className="max-w-[400px]"
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">Max 28 characters</p>
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
