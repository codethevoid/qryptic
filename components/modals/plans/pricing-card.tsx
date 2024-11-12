import { Card } from "@/components/ui/card";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Bot, ChartArea, Cog, Globe, Link, QrCode, User } from "lucide-react";
import { type Plan } from "@/lib/hooks/swr/use-plans";
import NumberFlow from "@number-flow/react";

type PricingCardProps = {
  plan: Plan;
  interval: "year" | "month";
  setInterval: (interval: "year" | "month") => void;
};

const getMonthlyPrice = (plan: Plan, interval: "month" | "year") => {
  const price = plan.prices.find((price) => price.interval === interval)?.price as number;
  return interval === "month" ? price : price / 12;
};

// this will format the analytics data based on the number of days
const getAnalytics = (days: number) => {
  const years = days >= 365 ? days / 365 : null;
  if (years) return `${Math.round(years)} year${Math.round(years) > 1 ? "s" : ""}`;
  // if days is greater than 90, divide by 30 to get months
  const months = days >= 90 ? days / 30 : null;
  if (months) return `${Math.round(months)} months`;
  return `${days} days`;
};

export const PricingCard = ({ plan, interval, setInterval }: PricingCardProps) => {
  return (
    <Card className="w-full shadow-none">
      <div className="relative rounded-t-lg border-b bg-zinc-50 p-4 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center space-x-3">
            <p className="flex items-baseline space-x-[2px] text-xl font-semibold text-foreground">
              $
              <NumberFlow value={getMonthlyPrice(plan, interval)} />
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
            <Badge
              variant={interval === "year" ? "success" : "neutral"}
              className={`${interval === "month" ? "line-through" : undefined} ${interval === "year" ? "bg-green-500/10" : "undefined"}`}
            >
              Saving 20%
            </Badge>
          </div>
          <div className="flex min-w-[96px] items-center space-x-2">
            <SmallSwitch
              defaultChecked={interval === "year"}
              onCheckedChange={() => setInterval(interval === "year" ? "month" : "year")}
              className="shadow-none dark:data-[state=unchecked]:bg-muted"
            />
            <p className="text-[11px] font-medium uppercase text-muted-foreground">
              {interval === "year" ? "annually" : "monthly"}
            </p>
          </div>
        </div>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{plan.description}</p>
      </div>
      <div className="p-4">
        <div className="space-y-1.5">
          <Feature
            icon={<QrCode size={15} />}
            feature={`${plan.links.toLocaleString("en-us")} QR codes per month`}
          />
          <Feature
            icon={<Link size={15} />}
            feature={`${plan.links.toLocaleString("en-us")} links per month`}
          />
          <Feature
            icon={<ChartArea size={15} />}
            feature={`${getAnalytics(plan.analytics)} analytical data`}
          />
          <Feature icon={<Globe size={15} />} feature={`${plan.domains} custom domains`} />
          <Feature
            icon={<User size={15} />}
            feature={`${plan.seats} platform seat${plan.seats > 1 ? "s" : ""}`}
          />
          {/*<Feature icon={<Bot size={15} />} feature="AI features" />*/}
          <Feature icon={<Cog size={15} />} feature="Advanced link controls" />
        </div>
      </div>
    </Card>
  );
};

type FeatureProps = {
  icon: ReactNode;
  feature: string;
  className?: string;
  num?: number;
};

const Feature = ({ icon, feature, className }: FeatureProps) => {
  return (
    <div className="flex items-center space-x-2.5">
      {icon}
      <p className={cn("text-[13px] text-muted-foreground", className)}>{feature}</p>
    </div>
  );
};
