"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AlertCircle, Info, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import NextLink from "next/link";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { ChangeTrial } from "@/components/modals/plans/change-trial/change-trial";
import { TrialWillEnd } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/billing/cards/alerts/trial-will-end";
import { ChargesWillStart } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/billing/cards/alerts/charges-will-start";
import { CancelSubscription } from "@/components/modals/plans/cancel";
import { ResumeSubscription } from "@/components/modals/plans/resume";
import { CardProvider } from "@/components/modals/add-card/card-provider";
import { ChangePlan } from "@/components/modals/plans/change-plan/change-plan";
import { type TeamSettings } from "@/lib/hooks/swr/use-team-settings";

type PlanProps = {
  hasPaymentMethod: boolean;
  subscriptionStatus: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  price: { price: number; interval: "year" | "month" } | null;
  plan: TeamSettings["plan"];
  trialEndsAt: Date | null;
  teamName: string;
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
  teamName,
}: PlanProps) => {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isChangeTrialOpen, setIsChangeTrialOpen] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCardProviderOpen, setIsCardProviderOpen] = useState(false);

  const CancelButton = ({ label = "Cancel" }: { label?: string }) => {
    return (
      <Button size="sm" variant="outline" onClick={() => setIsCancelOpen(true)}>
        {label}
      </Button>
    );
  };

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
          <div className="flex items-center space-x-2.5">
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
                      <Badge variant="success" className="space-x-1.5">
                        <RefreshCw size={13} />
                        <span>Renews {format(trialEndsAt as Date, "MMM dd, yyyy")}</span>
                      </Badge>
                    ) : (
                      <Badge variant="primary" className="space-x-1.5">
                        <Info size={13} />
                        <span>Trial ends {format(trialEndsAt as Date, "MMM dd, yyyy")}</span>
                      </Badge>
                    )}
                  </>
                )}
                {subscriptionStatus === "active" && (
                  <>
                    {cancelAtPeriodEnd ? (
                      <Badge variant="error" className="space-x-1.5">
                        <XCircle size={13} />
                        <span>Cancels {format(subscriptionEnd as Date, "MMM dd, yyyy")}</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" className="space-x-1.5">
                        <RefreshCw size={13} />
                        <span>Renews {format(subscriptionEnd as Date, "MMM dd, yyyy")}</span>
                      </Badge>
                    )}
                  </>
                )}
                {subscriptionStatus === "past_due" && (
                  <Badge variant="warning" className="space-x-1.5">
                    <AlertCircle size={13} />
                    <span>Past due</span>
                  </Badge>
                )}
              </>
            )}
          </div>
          {plan.isFree ? (
            <p className="mt-1 text-[13px] text-muted-foreground">
              You are currently on the free plan. Upgrade for increased limits and features.
            </p>
          ) : (
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Current cycle: {format(subscriptionStart as Date, "MMM dd, yyyy")} -{" "}
              {format(subscriptionEnd as Date, "MMM dd, yyyy")}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">
            <span className="max-sm:hidden">Custom needs? </span>
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
                          <Button size="sm" onClick={() => setIsResumeOpen(true)}>
                            Resume plan
                          </Button>
                        ) : (
                          <CancelButton />
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
                      <Button size="sm" onClick={() => setIsResumeOpen(true)}>
                        Resume plan
                      </Button>
                    ) : (
                      <>
                        <CancelButton />
                        <Button size="sm" onClick={() => setIsChangePlanOpen(true)}>
                          Change plan
                        </Button>
                      </>
                    )}
                  </>
                )}
                {subscriptionStatus === "past_due" && (
                  <>
                    <CancelButton label="Cancel plan" />
                    <Button size="sm" onClick={() => setIsCardProviderOpen(true)}>
                      Update card
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
      <ChangeTrial isOpen={isChangeTrialOpen} setIsOpen={setIsChangeTrialOpen} />
      <CancelSubscription
        isOpen={isCancelOpen}
        setIsOpen={setIsCancelOpen}
        status={subscriptionStatus}
      />
      <ResumeSubscription isOpen={isResumeOpen} setIsOpen={setIsResumeOpen} />
      <CardProvider
        isOpen={isCardProviderOpen}
        hasPaymentMethod={hasPaymentMethod}
        setIsOpen={setIsCardProviderOpen}
        name={teamName}
      />
      <ChangePlan isOpen={isChangePlanOpen} setIsOpen={setIsChangePlanOpen} />
    </>
  );
};
