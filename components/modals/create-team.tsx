import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeamSchema, CreateTeamFormValues } from "@/lib/validation/teams/create";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createTeam } from "@/actions/teams/create";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { mutate } from "swr";

type CreateTeamProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const CreateTeam = ({ isOpen, setIsOpen }: CreateTeamProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { update } = useSession();
  const router = useRouter();

  const onSubmit = async (values: CreateTeamFormValues) => {
    setIsLoading(true);
    const { error, slug, message, description } = await createTeam(values.name);
    if (error) {
      setIsLoading(false);
      if (description) return setError(description as string);
      return toast.error(message);
    }

    await update({ defaultTeam: slug });
    toast.success("Team created successfully!");
    await mutate("/api/teams");
    setIsOpen(false);
    setIsLoading(true);
    router.push(`/${slug}`);
  };

  useEffect(() => {
    if (isOpen) {
      reset();
      setError("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>Create a new team</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            A team is a shared workspace where you can organize all your work and collaborate with
            your team members.
          </DialogDescription>
          <div className="space-y-1.5">
            <Label htmlFor="team-name">Team name</Label>
            <Input id="team-name" placeholder="Acme" {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
          <p className="text-[13px] text-muted-foreground">
            Continuing will create a new team on our free plan.{" "}
            <NextLink href="/" className="text-deepBlue-500 hover:underline dark:text-deepBlue-400">
              Learn more
            </NextLink>
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg text-[13px]"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            size="sm"
            className="w-[100px] rounded-lg text-[13px]"
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Create team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
