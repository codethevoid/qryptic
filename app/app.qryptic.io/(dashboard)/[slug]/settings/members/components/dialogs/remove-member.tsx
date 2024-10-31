import { TeamSettings, useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  member: TeamSettings["members"][number] | null;
};

export const RemoveMember = ({ isOpen, setIsOpen, member }: Props) => {
  const { slug } = useParams();
  const { mutate } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/teams/${slug}/members/remove/${member?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      await mutate();
      setIsOpen(false);
      setIsLoading(false);
      toast.success("Member has been removed");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Failed to remove member");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="text-foreground">{member?.user.email}</span> from the team? They will
            no longer have access to the team unless re-invited by a team owner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={isLoading}
            onClick={handleRemove}
            className="w-[73px]"
          >
            {isLoading ? <ButtonSpinner /> : "Remove"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
