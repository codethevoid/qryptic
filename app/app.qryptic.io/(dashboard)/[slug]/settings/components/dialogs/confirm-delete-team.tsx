import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ConfirmDeleteTeam = ({ isOpen, setIsOpen }: Props) => {
  const { slug } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${slug}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      await mutate("/api/teams");
      router.push("/");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Error deleting team");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your team? This action cannot be undone.
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
            onClick={onDelete}
            className="w-[99px]"
          >
            {isLoading ? <ButtonSpinner /> : "Delete team"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
