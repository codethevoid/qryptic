"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plan, Price } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle, Info, RefreshCw, TriangleAlert, XCircle } from "lucide-react";
import { useState } from "react";
import NextLink from "next/link";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { ChangeTrial } from "@/components/modals/plans/change-trial/change-trial";
import { TrialWillEnd } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/billing/cards/alerts/trial-will-end";
import { ChargesWillStart } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/billing/cards/alerts/charges-will-start";
import { usePathname } from "next/navigation";

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
  const path = usePathname();

  return (
    <>
      {subscriptionStatus === "trialing" && !hasPaymentMethod && (
        <TrialWillEnd trialEndsAt={trialEndsAt as Date} planName={plan.name} />
      )}
      {subscriptionStatus === "trialing" && hasPaymentMethod && !cancelAtPeriodEnd && (
        <ChargesWillStart
          price={price?.price as number}
          interval={price?.interval as "year" | "month"}
          trialEndsAt={trialEndsAt as Date}
        />
      )}
      <Card>
        <CardHeader>
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
                {subscriptionStatus === "trialing" && (
                  <>
                    {hasPaymentMethod && !cancelAtPeriodEnd ? (
                      <Badge variant="success" className="space-x-1">
                        <RefreshCw size={13} />
                        <span>Renews {format(trialEndsAt as Date, "MMM, dd yyyy")}</span>
                      </Badge>
                    ) : (
                      <Badge variant="primary" className="space-x-1">
                        <Info size={13} />
                        <span>Trial ends {format(trialEndsAt as Date, "MMM, dd yyyy")}</span>
                      </Badge>
                    )}
                  </>
                )}
                {subscriptionStatus === "active" && (
                  <>
                    {cancelAtPeriodEnd ? (
                      <Badge variant="error" className="space-x-1">
                        <XCircle size={13} />
                        <span>Cancels {format(subscriptionEnd as Date, "MMM, dd yyyy")}</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" className="space-x-1">
                        <RefreshCw size={13} />
                        <span>Renews {format(subscriptionEnd as Date, "MMM, dd yyyy")}</span>
                      </Badge>
                    )}
                  </>
                )}
                {subscriptionStatus === "past_due" && (
                  <Badge variant="warning" className="space-x-1">
                    <AlertCircle size={13} />
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
          <div className="flex space-x-2">
            {plan.isFree ? (
              <Button size="sm" onClick={() => setIsUpgradeOpen(true)}>
                Upgrade
              </Button>
            ) : (
              <>
                {subscriptionStatus === "trialing" && (
                  <>
                    {hasPaymentMethod && (
                      <>
                        {cancelAtPeriodEnd ? (
                          <Button size="sm" variant="outline">
                            Resume plan
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                    {!cancelAtPeriodEnd && (
                      <Button size="sm" onClick={() => setIsChangeTrialOpen(true)}>
                        Change plan
                      </Button>
                    )}
                  </>
                )}
                {subscriptionStatus === "active" && (
                  <>
                    {cancelAtPeriodEnd ? (
                      <Button size="sm" variant="outline">
                        Resume plan
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button size="sm" asChild>
                          <NextLink href={`${path}/change-plan`}>Change plan</NextLink>
                        </Button>
                      </>
                    )}
                  </>
                )}
                {subscriptionStatus === "past_due" && (
                  <>
                    <Button size="sm" variant="outline">
                      Cancel plan
                    </Button>
                    <Button size="sm">Update card</Button>
                  </>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
      <ChangeTrial isOpen={isChangeTrialOpen} setIsOpen={setIsChangeTrialOpen} />
    </>
  );
};
