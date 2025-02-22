"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/components/layout/loader";
import { PaymentMethodCard } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/billing/cards/payment-method";
import { PlanCard } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/billing/cards/plan";

export const BillingClient = () => {
  const { data: team, isLoading, error } = useTeamSettings();

  if (isLoading) return <Loader />;

  if (error) return <div>Failed to load team settings</div>;

  if (!team) return <div>Team not found</div>;

  return (
    <div className="flex flex-col space-y-6">
      <PlanCard
        hasPaymentMethod={!!team?.paymentMethod}
        subscriptionStatus={team?.subscriptionStatus}
        cancelAtPeriodEnd={team?.cancelAtPeriodEnd}
        price={team?.price}
        plan={team?.plan}
        subscriptionStart={team?.subscriptionStart}
        subscriptionEnd={team?.subscriptionEnd}
        trialEndsAt={team?.trialEndsAt}
        teamName={team?.name}
      />
      {!team?.plan.isFree && (
        <PaymentMethodCard paymentMethod={team?.paymentMethod} name={team?.name as string} />
      )}
    </div>
  );
};
