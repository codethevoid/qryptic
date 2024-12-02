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
  Tag,
  PiggyBank,
  Ghost,
  Cog,
  Router,
  CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { appDomain, protocol } from "@/utils/qryptic/domains";
import NextLink from "next/link";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import NumberFlow from "@number-flow/react";

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
    if (years) return `${Math.round(years)} year${Math.round(years) > 1 ? "s" : ""}`;
    // if days is greater than 90, divide by 30 to get months
    const months = days >= 90 ? days / 30 : null;
    if (months) return `${Math.round(months)} months`;
    return `${days} days`;
  };

  return (
    <div className="px-4">
      <MaxWidthWrapper className="max-w-[1200px]">
        {/*<div className="mx-auto mb-4 w-fit rounded-full bg-gradient-to-t from-purple-600 to-purple-900 p-[1px]">*/}
        {/*  <div className="rounded-full bg-gradient-to-t from-background/80 to-card px-3 py-1">*/}
        {/*    <p className="text-[13px] font-semibold text-purple-400">Plans and pricing</p>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="mb-6 max-sm:mb-4">
          <h1 className="text-center text-4xl font-bold tracking-tight max-md:text-3xl max-sm:mx-auto max-sm:max-w-[310px] max-sm:text-3xl">
            Give your business the{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              edge it deserves
            </span>
          </h1>
          <p className="mt-2 text-center text-muted-foreground max-md:text-sm max-sm:mx-auto max-sm:max-w-[320px] max-sm:text-[13px]">
            Connect with your audience and grow your business with our powerful suite of tools.
          </p>
        </div>
        <div className="mx-auto mb-8 max-w-[500px] max-sm:mb-6">
          {/*<Tabs*/}
          {/*  className="w-full"*/}
          {/*  defaultValue={interval}*/}
          {/*  onValueChange={(value: any) => setInterval(value)}*/}
          {/*>*/}
          {/*  <TabsList className="h-10 w-full rounded-full">*/}
          {/*    <TabsTrigger value="month" className="h-full w-full rounded-full text-[13px]">*/}
          {/*      Pay monthly*/}
          {/*    </TabsTrigger>*/}
          {/*    <TabsTrigger value="year" className="h-full w-full rounded-full text-[13px]">*/}
          {/*      Pay yearly (Save 20%)*/}
          {/*    </TabsTrigger>*/}
          {/*  </TabsList>*/}
          {/*</Tabs>*/}
          <div className="flex items-center justify-center space-x-3">
            <p
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors max-sm:text-[13px]",
                interval === "month" && "text-foreground",
              )}
            >
              Pay monthly
            </p>
            <Switch
              checked={interval === "year"}
              onCheckedChange={(value) => (value ? setInterval("year") : setInterval("month"))}
              // className="max-sm:hidden"
            />
            {/* <SmallSwitch
              checked={interval === "year"}
              onCheckedChange={(value) => (value ? setInterval("year") : setInterval("month"))}
              className="hidden max-sm:block"
            /> */}
            <p
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors max-sm:text-[13px]",
                interval === "year" && "text-foreground",
              )}
            >
              Pay yearly
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-sm:grid-cols-1">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`w-full rounded-none rounded-xl border shadow-sm max-[876px]:mx-auto max-[876px]:max-w-[500px]`}
            >
              <CardHeader className="pb-3">
                <div className="relative flex w-full items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {!plan.isFree && (
                    <Badge
                      variant={interval === "year" ? "success" : "neutral"}
                      className={`absolute right-0 flex space-x-1 rounded-full px-1.5 ${interval === "month" ? "line-through" : ""} transition-all`}
                    >
                      <span className="text-xs">Save 20%</span>
                    </Badge>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex items-baseline space-x-1 text-3xl font-extrabold">
                  {/* <span>{plan.isFree ? "$0" : `$${getMonthlyPrice(plan)}`}</span> */}
                  $<NumberFlow value={plan.isFree ? 0 : getMonthlyPrice(plan)} />
                  <span className="text-[13px] font-normal text-muted-foreground">/month</span>
                </p>
                <p className="-mt-1 text-[13px] text-muted-foreground">
                  {plan.isFree
                    ? "Forever free"
                    : interval === "month"
                      ? "Billed monthly"
                      : "Billed annually"}
                </p>
                <Button
                  className={`group my-4 h-10 w-full justify-between rounded-full group-hover:translate-x-1`}
                  variant={index > 0 ? "default" : "outline"}
                  asChild
                >
                  <a href={`${protocol}${appDomain}/register`}>
                    <span>{plan.isFree ? "Start for free" : "Get started"}</span>
                    <ChevronArrow
                      className={index === 0 ? "bg-black dark:bg-white" : "bg-white dark:bg-black"}
                    />
                  </a>
                </Button>
                <div className="flex flex-col space-y-1.5">
                  <Feature
                    icon={<CheckIcon size={15} />}
                    feature={`${plan.links.toLocaleString("en-us")} QR codes/mo`}
                  />
                  <Feature
                    icon={<CheckIcon size={15} />}
                    feature={`${plan.links.toLocaleString("en-us")} links/mo`}
                  />
                  <Feature icon={<CheckIcon size={15} />} feature="Unlimited event tracking" />
                  <Feature
                    icon={<CheckIcon size={15} />}
                    feature={`${getAnalytics(plan.analytics)} analytical data`}
                  />
                  <Feature
                    icon={<CheckIcon size={15} />}
                    feature={`${plan.domains} Custom domain${plan.domains > 1 ? "s" : ""}`}
                  />
                  <Feature
                    icon={<CheckIcon size={15} />}
                    feature={`${plan.seats} platform seat${plan.seats > 1 ? "s" : ""}`}
                  />

                  {/*{plan.qrCustomization && (*/}
                  {/*  <Feature icon={<Bot size={16} />} feature="AI QR generation" />*/}
                  {/*)}*/}
                  {/* {!plan.isFree && <Feature icon={<Bot size={16} />} feature="AI features" />} */}
                  {!plan.isFree && (
                    <Feature icon={<CheckIcon size={15} />} feature="Advanced link controls" />
                  )}
                  {!plan.isFree && (
                    <Feature icon={<CheckIcon size={15} />} feature="Domain redirector" />
                  )}
                  {!plan.isFree && (
                    <Feature icon={<CheckIcon size={15} />} feature="UTM parameter tracking" />
                  )}
                  {!plan.isFree && (
                    <Feature icon={<CheckIcon size={15} />} feature="API access (coming soon)" />
                  )}
                  <Feature
                    icon={<CheckIcon size={15} />}
                    feature={`${plan.supportLevel} support`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {/* <Card className="col-span-3 rounded-xl border shadow-sm">
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
                <Button
                  className="group mt-8 flex h-10 w-full max-w-[300px] justify-between rounded-full"
                  asChild
                >
                  <NextLink href="/contact/sales">
                    <span>Contact sales</span>
                    <ChevronArrow className="bg-white dark:bg-black" />
                  </NextLink>
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
          </Card> */}
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
    <div className="flex items-center space-x-2.5">
      {icon}
      <p className={cn("text-[13px] text-muted-foreground", className)}>{feature}</p>
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
