import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const LeaveTeam = ({ isOpen, setIsOpen }: Props) => {
  const router = useRouter();
  const { data: team } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleLeave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${team?.slug}/leave`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        return toast.error("Failed to leave team", {
          description: data.error,
        });
      }

      await mutate(`/api/teams`);
      // push to home page so it can handle the default team redirect
      router.push("/");
    } catch (e) {
      setIsLoading(false);
      console.error(e);
      toast.error("Failed to leave team");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave the team{" "}
            <span className="text-foreground">{team?.name}</span>? You will not be able to access
            this team unless re-invited by an owner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleLeave}
            variant="danger"
            className="w-[95px]"
            disabled={isLoading}
          >
            {isLoading ? <ButtonSpinner /> : "Leave team"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
