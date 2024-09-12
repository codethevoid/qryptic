"use server";

import { auth } from "@/auth";
import { verifyOwnership } from "@/lib/auth/verify-ownership";
import { stripe } from "@/utils/stripe";
import prisma from "@/db/prisma";

export const cancelPlan = async (slug: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // verify ownership of team
  const { isAuthorized, team } = await verifyOwnership(slug, token.userId);
  if (!isAuthorized) return { error: true, message: "Unauthorized" };

  if (!team?.stripeSubscriptionId) return { error: true, message: "No subscription found" };

  // if team is past due, cancel immediately
  if (team?.subscriptionStatus === "past_due") {
    // get free plan from db
    const freePlan = await prisma.plan.findFirst({
      where: { isFree: true, isLegacy: false, isCustom: false },
    });
    await stripe.subscriptions.cancel(team?.stripeSubscriptionId as string);

    // update team to free plan
    await prisma.team.update({
      where: { id: team?.id },
      data: {
        plan: { connect: { id: freePlan?.id } },
        stripeSubscriptionId: null,
        subscriptionStatus: "active",
        subscriptionStart: null,
        subscriptionEnd: null,
        failedInvoiceId: null,
        cancelAtPeriodEnd: false,
        trialEndsAt: null,
        paymentMethodId: null,
        paymentMethodType: null,
        paymentMethodBrand: null,
        paymentMethodLast4: null,
        paymentMethodExpMonth: null,
        paymentMethodExpYear: null,
      },
    });

    return { message: "Plan canceled successfully" };
  }

  // cancel subscription
  await stripe.subscriptions.update(team?.stripeSubscriptionId as string, {
    cancel_at_period_end: true,
  });

  await prisma.team.update({ where: { id: team.id }, data: { cancelAtPeriodEnd: true } });

  return { message: "Plan canceled successfully" };
};
