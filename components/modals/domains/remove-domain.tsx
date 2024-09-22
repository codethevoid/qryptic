import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

type RemoveDomainProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  mutateDomains: () => Promise<void>;
  domainName?: string;
};

const removeDomain = async (name: string, slug: string) => {
  try {
    // DELETE /api/domains/:teamSlug/remove/:domainName
    const res = await fetch(`/api/domains/${slug}/remove/${name}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { message: "Domain removed successfully" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to remove domain" };
  }
};

export const RemoveDomain = ({
  isOpen,
  setIsOpen,
  domainName,
  mutateDomains,
}: RemoveDomainProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();

  const handleRemoveDomain = async () => {
    setIsLoading(true);
    const { error } = await removeDomain(domainName as string, slug as string);
    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Domain removed successfully");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove domain</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{domainName}</span>? All links and events
            associated with this domain will be deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-[74px]"
            disabled={isLoading}
            onClick={handleRemoveDomain}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
