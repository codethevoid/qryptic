"use client";

import { Plan, Price } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronArrow } from "@/components/ui/chevron-arrow";
import { ReactNode } from "react";
import {
  Link,
  QrCode,
  ChartArea,
  MousePointerClick,
  User,
  Globe,
  Headset,
  Bot,
  Wrench,
  Fingerprint,
  Milestone,
  ServerCog,
  Infinity,
  Sparkles,
  ShieldCheck,
  BrainCog,
  WandSparkles,
  AppWindowMac,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CustomPlan = Plan & {
  prices: Price[];
};

type PricingTierProps = {
  plans: CustomPlan[];
};

export const PricingTiers = ({ plans }: PricingTierProps) => {
  const [interval, setInterval] = useState<"month" | "year">("year");

  // This function will take the plan and return the monthly price
  // if the interval is year, it will divide the price by 12 to get to the monthly price
  const getMonthlyPrice = (plan: CustomPlan) => {
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

  return (
    <div className="px-4">
      <MaxWidthWrapper>
        <div className="mb-6">
          <h1 className="text-center text-3xl font-extrabold tracking-tight">
            Give your business the{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              edge it deserves
            </span>
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Connect with your audience and grow your business with our powerful suite of tools.
          </p>
        </div>
        <div className="mx-auto mb-8 max-w-[500px]">
          <Tabs
            className="w-full"
            defaultValue={interval}
            onValueChange={(value: any) => setInterval(value)}
          >
            <TabsList className="h-10 w-full rounded-full">
              <TabsTrigger value="month" className="h-full w-full rounded-full text-[13px]">
                Pay monthly
              </TabsTrigger>
              <TabsTrigger value="year" className="h-full w-full rounded-full text-[13px]">
                Pay yearly (Save 20%)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr]">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`w-full rounded-none shadow-none ${index > 0 ? "border-l-0" : ""}`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex items-baseline space-x-1 text-3xl font-extrabold">
                  <span>{plan.isFree ? "$0" : `$${getMonthlyPrice(plan)}`}</span>
                  <span className="text-[13px] font-normal text-muted-foreground">/month</span>
                </p>
                <p className="-mt-1 text-[13px] text-muted-foreground">
                  {plan.isFree
                    ? "Forever free. Upgrade anytime."
                    : interval === "month"
                      ? "Billed monthly"
                      : "Billed annually"}
                </p>
                <Button
                  className={`group my-6 h-10 w-full justify-between rounded-full group-hover:translate-x-1 ${index === 1 ? "bg-deepBlue-500 text-white hover:bg-deepBlue-600" : undefined}`}
                  variant={index === 1 || index === 2 ? "default" : "outline"}
                >
                  <span>{plan.isFree ? "Start for free" : "Start free trial"}</span>
                  <ChevronArrow
                    className={
                      index === 0
                        ? "bg-black dark:bg-white"
                        : index === 1
                          ? "bg-white"
                          : "bg-white dark:bg-black"
                    }
                  />
                </Button>
                <div className="flex flex-col space-y-2">
                  <Feature
                    icon={<QrCode size={16} />}
                    feature={`${plan.links.toLocaleString("en-us")} QR codes per month`}
                  />
                  <Feature
                    icon={<Link size={16} />}
                    feature={`${plan.links.toLocaleString("en-us")} links per month`}
                  />
                  <Feature
                    icon={<MousePointerClick size={16} />}
                    feature="Unlimited click & scan tracking"
                  />
                  <Feature
                    icon={<ChartArea size={16} />}
                    feature={`${getAnalytics(plan.analytics)} analytical data`}
                  />
                  <Feature
                    icon={<Globe size={16} />}
                    feature={`${plan.domains} Custom domain${plan.domains > 1 ? "s" : ""}`}
                  />
                  <Feature
                    icon={<User size={16} />}
                    feature={`${plan.seats} platform seat${plan.seats > 1 ? "s" : ""}`}
                  />
                  {plan.apiAccess && (
                    <Feature icon={<AppWindowMac size={16} />} feature="API access (coming soon)" />
                  )}
                  {plan.qrCustomization && (
                    <Feature icon={<Bot size={16} />} feature="AI QR generation" />
                  )}
                  {plan.aiInsights && (
                    <Feature icon={<BrainCog size={16} />} feature="AI insights" />
                  )}
                  {plan.smartRules && (
                    <Feature icon={<WandSparkles size={16} />} feature="Advanced smart rules" />
                  )}
                  {plan.domainRedirector && (
                    <Feature icon={<Milestone size={16} />} feature="Domain redirector" />
                  )}
                  <Feature icon={<Headset size={16} />} feature={`${plan.supportLevel} support`} />
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="col-span-3 rounded-none border-t-0 shadow-none">
            <div className="grid grid-cols-2 gap-6 p-12">
              <div>
                <p className="text-2xl font-extrabold tracking-tight">
                  Qryptic{" "}
                  <span className="bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
                    Enterprise
                  </span>
                </p>
                <p className="mt-6 text-sm">
                  Join the ranks of our enterprise customers and get access to our most advanced
                  features, custom usage limits, and dedicated support.
                </p>
                <Button className="group mt-8 flex h-10 w-full max-w-[300px] justify-between rounded-full">
                  <span>Contact sales</span>
                  <ChevronArrow className="bg-white dark:bg-black" />
                </Button>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-8">
                <div className="flex flex-col space-y-2">
                  <Feature
                    icon={<Infinity size={16} />}
                    feature="Custom usage limits"
                    className="font-medium text-foreground"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    Get custom limits on links, QR codes, analytics, seats, and domains based on
                    your specific needs.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Feature
                    icon={<Fingerprint size={16} />}
                    feature="Role-based access controls"
                    className="font-medium text-foreground"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    Implement granular access controls to ensure secure and customized access for
                    each user.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Feature
                    icon={<Sparkles size={16} />}
                    feature="Dedicated support manager"
                    className="font-medium text-foreground"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    Access your dedicated support representative anytime, day or night, for all your
                    needs.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Feature
                    icon={<ShieldCheck size={16} />}
                    feature="Single sign-on (SSO)"
                    className="font-medium text-foreground"
                  />
                  <p className="text-[13px] text-muted-foreground">
                    Enjoy the convenience of self-serve SSO with enhanced control over your
                    authentication setup.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

type FeatureProps = {
  icon: ReactNode;
  feature: string | ReactNode;
  className?: string;
};

const Feature = ({ icon, feature, className }: FeatureProps) => {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <p className={cn("text-sm text-muted-foreground", className)}>{feature}</p>
    </div>
  );
};

// <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//   <path
//     d="M20 50 L40 70 L80 30"
//     fill="none"
//     stroke="#66ff00"
//     stroke-width="10"
//     stroke-linecap="round"
//     stroke-linejoin="round"
//     strokeDasharray="100"
//     stroke-dashoffset="100"
//   >
//     <animate
//       attributeName="stroke-dashoffset"
//       from="100"
//       to="0"
//       dur="0.5s"
//       fill="freeze"
//       begin="0.3s"
//     />
//   </path>
// </svg>
