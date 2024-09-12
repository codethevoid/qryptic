import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { mutate } from "swr";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { resumePlan } from "@/actions/plans/resume";

type CancelSubscriptionProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ResumeSubscription = ({ isOpen, setIsOpen }: CancelSubscriptionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resume subscription</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Are you sure you want to resume your subscription? You will continue to be billed for
            your subscription like normal.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="w-[104px]"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await resumePlan(slug as string);
              await mutate(`/api/teams/${slug}`);
              await mutate(`/api/teams/${slug}/settings`);
              toast.success("Subscription resumed");
              setIsOpen(false);
              setIsLoading(false);
            }}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Resume plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
