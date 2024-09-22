import { Info } from "lucide-react";
import { format } from "date-fns";

type TrialWillEndProps = {
  trialEndsAt: Date;
  planName: string;
};

export const TrialWillEnd = ({ trialEndsAt, planName }: TrialWillEndProps) => {
  return (
    <div className="w-full rounded-lg border border-deepBlue-200 bg-deepBlue-500/5 px-4 py-2 shadow-sm dark:border-deepBlue-800 dark:bg-deepBlue-500/10">
      <div className="flex items-start space-x-2">
        <Info
          size={15}
          className="relative top-[2px] shrink-0 text-deepBlue-500 dark:text-deepBlue-400"
        />
        <p className="text-[13px] text-deepBlue-500 dark:text-deepBlue-400">
          Your trial ends on {format(trialEndsAt as Date, "MMMM dd, yyyy")}. Add a payment method to
          continue using Qryptic on the {planName} plan.
        </p>
      </div>
    </div>
  );
};
