import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { toast } from "sonner";
import { useState } from "react";
import { useParams } from "next/navigation";

const archiveDomain = async (name: string, slug: string) => {
  try {
    // PATCH /api/domains/:slug/archive
    // body = { name }
    const res = await fetch(`/api/domains/${slug}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { message: "Domain archived" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to archive domain" };
  }
};

type ArchiveDomainProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  domainName?: string;
  mutateDomains: () => Promise<void>;
};

export const ArchiveDomain = ({
  isOpen,
  setIsOpen,
  domainName,
  mutateDomains,
}: ArchiveDomainProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();

  const handleArchive = async () => {
    setIsLoading(true);
    const { error } = await archiveDomain(domainName as string, slug as string);
    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Domain archived");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive domain</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive{" "}
            <span className="font-medium text-foreground">{domainName}</span>? All existing links
            will still work but you will not be able to create new links with this domain.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleArchive} disabled={isLoading} className="w-[71px]">
            {isLoading ? <ButtonSpinner /> : "Archive"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
