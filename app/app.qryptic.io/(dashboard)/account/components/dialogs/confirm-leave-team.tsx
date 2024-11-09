import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { type Selected } from "@/app/app.qryptic.io/(dashboard)/account/teams/client";
import { useState } from "react";
import { toast } from "sonner";
import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { mutate as mutateGlobal } from "swr";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selected: Selected | null;
};

export const ConfirmLeaveTeam = ({ isOpen, setIsOpen, selected }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useUserSettings();

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/leave-team/${selected?.team.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error("Failed to leave team", {
          description: data.error,
        });
        return;
      }

      await Promise.allSettled([mutate(), mutateGlobal("/api/me"), mutateGlobal("/api/teams")]);
      setIsLoading(false);
      setIsOpen(false);
      toast.success("Successfully left team");
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to leave team");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave the team{" "}
            <span className="text-foreground">{selected?.team.name}</span>? You will have to be
            re-invited by an owner to access this team again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" disabled={isLoading} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={isLoading}
            onClick={onConfirm}
            className="w-[95px]"
          >
            {isLoading ? <ButtonSpinner /> : "Leave team"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
