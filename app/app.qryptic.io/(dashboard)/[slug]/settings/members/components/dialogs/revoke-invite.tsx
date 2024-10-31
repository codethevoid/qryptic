import { TeamSettings, useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import {
  AlertDialogTitle,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invite: TeamSettings["invites"][number] | null;
};

export const RevokeInvite = ({ isOpen, setIsOpen, invite }: Props) => {
  const { slug } = useParams();
  const { mutate } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/teams/${slug}/invites/revoke/${invite?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      await mutate();
      setIsLoading(false);
      toast.success("Invite has been revoked");
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Failed to revoke invite");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke invite</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke the invite for{" "}
            <span className="text-foreground">{invite?.email}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-[69px]"
            disabled={isLoading}
            onClick={handleRevoke}
          >
            {isLoading ? <ButtonSpinner /> : "Revoke"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
