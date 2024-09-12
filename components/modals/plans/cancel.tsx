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
import { cancelPlan } from "@/actions/plans/cancel";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { mutate } from "swr";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type CancelSubscriptionProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  status: string;
};

export const CancelSubscription = ({ isOpen, setIsOpen, status }: CancelSubscriptionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel subscription</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Are you sure you want to cancel your subscription? You will lose access to all pro
            features{" "}
            {status === "trialing"
              ? "after your trial ends."
              : status === "past_due"
                ? "immediately."
                : "at the end of your billing period."}
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-[96px]"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await cancelPlan(slug as string);
              await mutate(`/api/teams/${slug}`);
              await mutate(`/api/teams/${slug}/settings`);
              toast.success("Subscription canceled");
              setIsOpen(false);
              setIsLoading(false);
            }}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Cancel plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
