import { PlanWithPrices } from "@/types/plans";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SmallSwitch } from "@/components/ui/small-switch";
import { Badge } from "@/components/ui/badge";

type PricingCardProps = {
  plan: PlanWithPrices;
  interval: "year" | "month";
  setInterval: (interval: "year" | "month") => void;
};

const getMonthlyPrice = (plan: PlanWithPrices, interval: "month" | "year") => {
  const price = plan.prices.find((price) => price.interval === interval)?.price as number;
  return interval === "month" ? price : price / 12;
};

// this will format the analytics data based on the number of days
const getAnalytics = (days: number) => {
  const years = days >= 365 ? days / 365 : null;
  if (years) return `${years} year${years > 1 ? "s" : ""}`;
  // if days is greater than 90, divide by 30 to get months
  const months = days >= 90 ? days / 30 : null;
  if (months) return `${months} months`;
  return `${days} days`;
};

export const PricingCard = ({ plan, interval, setInterval }: PricingCardProps) => {
  return (
    <Card className="w-full shadow-none">
      <div className="relative rounded-t-lg border-b bg-zinc-50 p-4 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center space-x-3">
            <p className="flex items-baseline space-x-1 text-xl font-semibold text-foreground">
              <span>${getMonthlyPrice(plan, interval)}</span>
              <span className="text-xs font-normal text-muted-foreground">/month</span>{" "}
            </p>
            <Badge
              variant={interval === "year" ? "success" : "neutral"}
              className={interval === "month" ? "line-through" : undefined}
            >
              Saving 20%
            </Badge>
          </div>
          <div className="flex min-w-[96px] items-center space-x-2">
            <SmallSwitch
              defaultChecked={interval === "year"}
              onCheckedChange={() => setInterval(interval === "year" ? "month" : "year")}
              className="shadow-none data-[state=unchecked]:bg-transparent"
            />
            <p className="text-[11px] font-medium uppercase text-muted-foreground">
              {interval === "year" ? "annually" : "monthly"}
            </p>
          </div>
        </div>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{plan.description}</p>
      </div>
      <div className="px-4 py-6"></div>
    </Card>
  );
};
