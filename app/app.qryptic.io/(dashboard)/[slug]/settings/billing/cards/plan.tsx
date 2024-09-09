"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plan, Price } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Info, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import NextLink from "next/link";
import { createPortal } from "@/actions/checkout/create-portal";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { subscription } from "swr/subscription";
import { ChangeTrial } from "@/components/modals/plans/change-trial/change-trial";

type PlanProps = {
  hasPaymentMethod: boolean;
  subscriptionStatus: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  price: Price | null;
  plan: Plan;
  trialEndsAt: Date | null;
  slug: string;
};

export const PlanCard = ({
  hasPaymentMethod,
  subscriptionStatus,
  subscriptionStart,
  subscriptionEnd,
  cancelAtPeriodEnd,
  price,
  plan,
  trialEndsAt,
  slug,
}: PlanProps) => {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isChangeTrialOpen, setIsChangeTrialOpen] = useState(false);

  return (
    <>
      {subscriptionStatus === "trialing" && !hasPaymentMethod && (
        <div className="w-full rounded-lg border border-deepBlue-200 bg-deepBlue-500/5 p-4 shadow dark:border-deepBlue-800 dark:bg-deepBlue-500/10">
          <div className="flex items-start space-x-2">
            <Info
              size={15}
              className="relative top-[2px] shrink-0 text-deepBlue-500 dark:text-deepBlue-400"
            />
            <p className="text-[13px] text-deepBlue-500 dark:text-deepBlue-400">
              Your trial ends on {format(trialEndsAt as Date, "MMMM dd, yyyy")}. Add a payment
              method to continue using Qryptic on the {plan.name} plan.
            </p>
          </div>
        </div>
      )}
      {subscriptionStatus === "trialing" && hasPaymentMethod && (
        <div className="w-full rounded-lg border border-green-300 bg-green-500/5 p-4 shadow dark:border-green-900 dark:bg-green-500/10">
          <div className="flex items-start space-x-2">
            <RefreshCw
              size={15}
              className="relative top-[2px] shrink-0 text-green-600 dark:text-green-500"
            />
            <p className="text-[13px] text-green-600 dark:text-green-500">
              Your trial ends on {format(trialEndsAt as Date, "MMMM dd, yyyy")} and your
              subscription will renew automatically until you cancel.
            </p>
          </div>
        </div>
      )}
      <Card>
        <CardHeader className="rounded-t-lg dark:bg-zinc-950">
          <CardTitle>{plan.name} plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {plan.isFree && (
              <p className="text-sm font-medium">Upgrade for increased limits and features.</p>
            )}
            {!plan.isFree && (
              <p className="font-semibold">
                {price?.price.toLocaleString("en-us", {
                  style: "currency",
                  currency: "usd",
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                <span className="text-xs font-normal text-muted-foreground">
                  /{price?.interval === "year" ? "yr" : "mo"}
                </span>
              </p>
            )}
            {!plan.isFree && (
              <>
                {subscriptionStatus === "trialing" && !hasPaymentMethod && (
                  <Badge variant="primary" className="space-x-1">
                    <Info size={13} />
                    <span>Trial ends {format(trialEndsAt as Date, "MMM, dd yyyy")}</span>
                  </Badge>
                )}
                {subscriptionStatus === "trialing" && hasPaymentMethod && (
                  <Badge variant="success" className="space-x-1">
                    <RefreshCw size={13} />
                    <span>Renews {format(trialEndsAt as Date, "MMM, dd yyyy")}</span>
                  </Badge>
                )}
                {subscriptionStatus === "active" && !cancelAtPeriodEnd && (
                  <Badge variant="success" className="space-x-1">
                    <RefreshCw size={13} />
                    <span>Renews {format(subscriptionEnd as Date, "MMM, dd yyyy")}</span>
                  </Badge>
                )}
                {subscriptionStatus === "active" && cancelAtPeriodEnd && (
                  <Badge variant="error" className="space-x-1">
                    <XCircle size={13} />
                    <span>Cancels {format(subscriptionEnd as Date, "MMM, dd yyyy")}</span>
                  </Badge>
                )}
                {subscriptionStatus === "past_due" && (
                  <Badge variant="warning" className="space-x-1">
                    <XCircle size={13} />
                    <span>Past due</span>
                  </Badge>
                )}
              </>
            )}
          </div>
          {!plan.isFree && (
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Current cycle: {format(subscriptionStart as Date, "MMM dd, yyyy")} -{" "}
              {format(subscriptionEnd as Date, "MMM dd, yyyy")}
            </p>
          )}
          {plan.isFree && (
            <p className="mt-1 text-[13px] text-muted-foreground">
              You are currently on the free plan. Upgrade for increased limits and features.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">
            Custom needs?{" "}
            <NextLink
              href="/contact"
              className="text-deepBlue-500 hover:underline dark:text-deepBlue-400"
            >
              Contact sales
            </NextLink>
          </p>
          {plan.isFree && (
            <Button size="sm" onClick={() => setIsUpgradeOpen(true)}>
              Upgrade
            </Button>
          )}
          {!plan.isFree && subscriptionStatus === "trialing" && (
            <Button size="sm" onClick={() => setIsChangeTrialOpen(true)}>
              Change plan
            </Button>
          )}
          {!plan.isFree && !cancelAtPeriodEnd && subscriptionStatus !== "trialing" && (
            <Button size="sm" asChild>
              <NextLink href={`${slug}/settings/billing/change-plan`}>Change plan</NextLink>
            </Button>
          )}
        </CardFooter>
      </Card>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
      <ChangeTrial isOpen={isChangeTrialOpen} setIsOpen={setIsChangeTrialOpen} />
    </>
  );
};
