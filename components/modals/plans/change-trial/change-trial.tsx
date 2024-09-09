import { useEffect, useState } from "react";
import { PlanWithPrices } from "@/types/plans";
import { usePlans } from "@/lib/hooks/swr/use-plans";
import { useTeam } from "@/lib/hooks/swr/use-team";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ChangeTrialProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ChangeTrial = ({ isOpen, setIsOpen }: ChangeTrialProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanWithPrices | null>(null);
  const [interval, setInterval] = useState<"year" | "month">("year");
  const { plans } = usePlans();
  const { team } = useTeam();

  useEffect(() => {
    if (isOpen) setInterval("year");
    if (plans) setSelectedPlan(plans[0]);
  }, [isOpen, plans]);

  if (!plans) return null;

  const handlePlanChange = async () => {};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Select a plan to change to. Changes will take effect immediately.
          </DialogDescription>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
