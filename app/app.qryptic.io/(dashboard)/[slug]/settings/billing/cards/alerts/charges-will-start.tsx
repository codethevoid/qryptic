import { RefreshCw } from "lucide-react";
import { format } from "date-fns";

type ChargesWillStartProps = {
  price: number;
  interval: "year" | "month";
  trialEndsAt: Date;
};

export const ChargesWillStart = ({ price, interval, trialEndsAt }: ChargesWillStartProps) => {
  return (
    <div className="w-full rounded-lg border border-green-300 bg-green-500/5 p-4 shadow dark:border-green-900 dark:bg-green-500/10">
      <div className="flex items-start space-x-2">
        <RefreshCw
          size={15}
          className="relative top-[2px] shrink-0 text-green-600 dark:text-green-500"
        />
        <p className="text-[13px] text-green-600 dark:text-green-500">
          You will be charged{" "}
          {price.toLocaleString("en-us", {
            style: "currency",
            currency: "usd",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {interval === "year" ? "on a yearly basis" : "on a monthly basis"} at the end of your
          trial which is {format(trialEndsAt as Date, "MMMM dd, yyyy")}. You can cancel anytime.
        </p>
      </div>
    </div>
  );
};
