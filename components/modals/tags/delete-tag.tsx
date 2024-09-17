import { TagWithCounts } from "@/types/tags";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTag } from "@/actions/tags/delete-tag";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";

type DeleteTagProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  tag?: TagWithCounts;
  mutateTags: () => Promise<void>;
};

export const DeleteTag = ({ isOpen, setIsOpen, tag, mutateTags }: DeleteTagProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();
  const actionRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    const { error, message } = await deleteTag(tag as TagWithCounts, slug as string);
    if (error) {
      setIsLoading(false);
      return toast.error(message);
    }

    await mutateTags();
    setIsOpen(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) actionRef.current?.focus();
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag{" "}
            <span className="text-foreground">{tag?.name}</span>? It will be removed from all
            existing links. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-[88px]"
            disabled={isLoading}
            onClick={handleDelete}
            ref={actionRef}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Delete tag"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
