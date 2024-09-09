import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

type TrialStartedProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const TrialStarted = ({ isOpen, setIsOpen }: TrialStartedProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <PartyPopper size={18} />
            <span>Your 14 day trial has started!</span>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            You can now continue to use the full features of your current plan for the next 14 days.
            After the trial ends, you will be automatically downgraded to the free plan if you do
            not add a payment method.
          </DialogDescription>
          <p className="text-sm">You can add a payment method at any time in your team settings.</p>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Sounds good!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
