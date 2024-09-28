import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const unarchiveDomain = async (name: string, slug: string) => {
  try {
    // PATCH /api/domains/:slug/unarchive
    // body: { name: string }

    const res = await fetch(`/api/domains/${slug}/unarchive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { messge: "Domain unarchived successfully" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to unarchive domain" };
  }
};

type UnarchiveDomainProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  domainName?: string;
  mutateDomains: () => Promise<void>;
};

export const UnarchiveDomain = ({
  isOpen,
  setIsOpen,
  domainName,
  mutateDomains,
}: UnarchiveDomainProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();

  const handleUnarchive = async () => {
    setIsLoading(true);
    const { error } = await unarchiveDomain(domainName as string, slug as string);
    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Domain unarchived successfully");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unarchive domain</AlertDialogTitle>
          <AlertDialogDescription>
            Unarchiving <span className="font-medium text-foreground">{domainName}</span> will make
            it accessible. You will be able to start creating links with this domain again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" disabled={isLoading} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={isLoading} className="w-[74px]" onClick={handleUnarchive}>
            {isLoading ? <ButtonSpinner /> : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
