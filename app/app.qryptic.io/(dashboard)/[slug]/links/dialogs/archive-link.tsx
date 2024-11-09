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

export const ArchiveLink = ({ isOpen, setIsOpen, link, mutate }: Props) => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/links/${slug}/${link?.id}/archive`, {
        method: "PATCH",
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
      toast.success("Link archived");
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to archive link");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive this link? You can always restore it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button disabled={isLoading} size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} size="sm" className="w-[71px]" onClick={onConfirm}>
            {isLoading ? <ButtonSpinner /> : "Archive"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
