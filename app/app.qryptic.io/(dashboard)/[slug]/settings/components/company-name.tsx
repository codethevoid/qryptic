"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

const companySchema = z.object({
  company: z.string().max(50, { message: "Team name must no more than 50 characters" }).optional(),
});

type FormValues = z.infer<typeof companySchema>;

export const CompanyName = () => {
  const { data: team, mutate } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { company } = values;
      const res = await fetch(`/api/teams/${team?.slug}/update/company`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      await mutate();
      setIsLoading(false);
      toast.success("Company name has been updated");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Error updating company name");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Company name</CardTitle>
          <CardDescription className="text-[13px]">This will be shown on invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company name</Label>
            <Input
              defaultValue={team?.company}
              id="company"
              placeholder="Company name"
              className="max-w-[400px]"
              {...register("company")}
            />
            {errors.company && <p className="text-xs text-red-600">{errors.company.message}</p>}
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
