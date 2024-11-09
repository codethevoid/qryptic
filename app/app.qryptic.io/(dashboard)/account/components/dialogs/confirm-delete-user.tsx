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
import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ConfirmDeleteUser = ({ isOpen, setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setIsLoading(false);
        toast.error(data.error);
        return;
      }

      // sign out the user
      await signOut();
    } catch (e) {
      console.error(e);
      toast.error("Error deleting your account");
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action cannot be undone.
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
            className="w-[118px]"
          >
            {isLoading ? <ButtonSpinner /> : "Delete account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
