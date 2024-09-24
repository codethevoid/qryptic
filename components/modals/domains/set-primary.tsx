import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const setPrimaryDomain = async (name: string, slug: string) => {
  // PATCH /api/domains/:slug/primary
  try {
    const res = await fetch(`/api/domains/${slug}/primary`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to set primary domain" };
  }
};

type SetPrimaryProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  domainName?: string;
  mutateDomains: () => Promise<void>;
};

export const SetPrimary = ({ isOpen, setIsOpen, domainName, mutateDomains }: SetPrimaryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();

  const handleSetPrimary = async () => {
    setIsLoading(true);
    const { error } = await setPrimaryDomain(domainName as string, slug as string);
    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Domain set as primary");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set as primary domain</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to set{" "}
            <span className="font-medium text-foreground">{domainName}</span> as the primary domain?
            This domain will automatically be used when creating new links.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSetPrimary} disabled={isLoading} className="w-[74px]">
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
