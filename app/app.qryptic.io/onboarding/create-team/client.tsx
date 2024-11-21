"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeamSchema, CreateTeamFormValues } from "@/lib/validation/teams/create";
import { useState } from "react";
import { createTeam } from "@/actions/teams/create";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

export const CreateTeamClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = async (values: CreateTeamFormValues) => {
    setIsLoading(true);
    const { error, slug, message, description } = await createTeam(values.name);
    if (error) {
      setIsLoading(false);
      if (description) return setError(description as string);
      return toast.error(message);
    }

    router.push(`/${slug}`);
  };

  return (
    <div className="flex h-screen min-h-fit w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] space-y-6 rounded-xl border bg-background px-4 py-10 shadow-lg">
        <div className="mx-auto max-w-[320px] space-y-4">
          {/* <UserPlus size={30} className="mx-auto" /> */}
          <QrypticIcon className="mx-auto h-6 w-6" />
          <div className="space-y-1">
            <p className="text-center font-semibold">Create a new team</p>
            <p className="text-center text-[13px] text-muted-foreground">
              A team is a shared workspace where you can organize your work and collab with team
              members.
            </p>
          </div>
        </div>
        <form className="mx-auto max-w-[320px] space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Input placeholder="Team name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? <ButtonSpinner /> : "Create team"}
          </Button>
        </form>
      </div>
    </div>
  );
};
