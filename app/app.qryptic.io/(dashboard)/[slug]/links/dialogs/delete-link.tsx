import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { LinksTable, type TableLink } from "@/types/links";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  link: TableLink | null;
  mutate: () => Promise<void | LinksTable | undefined>;
};

export const DeleteLink = ({ isOpen, setIsOpen, link, mutate }: Props) => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/links/${slug}/${link?.id}/delete`, {
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
      setIsOpen(false);
      toast.success("Link deleted");
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to delete link");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this link? All data related to this link will be
            deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button disabled={isLoading} size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            size="sm"
            className="w-[64px]"
            variant="danger"
            onClick={onConfirm}
          >
            {isLoading ? <ButtonSpinner /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
