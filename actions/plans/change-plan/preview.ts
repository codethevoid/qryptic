"use server";

import { verifyOwnership } from "@/lib/auth/verify-ownership";
import { stripe } from "@/utils/stripe";
import prisma from "@/db/prisma";
import { auth } from "@/auth";

export const previewProration = async (slug: string, newPlanId: string, priceId: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  const { isAuthorized, team } = await verifyOwnership(slug, token.userId);
  if (!isAuthorized) return { error: true, message: "Unauthorized" };
  if (!team?.stripeSubscriptionId) return { error: true, message: "No subscription found" };
  if (team.subscriptionStatus !== "active") {
    return { error: true, message: "Subscription is not active" };
  }

  const newPlan = await prisma.plan.findUnique({
    where: { id: newPlanId, isFree: false, isLegacy: false, isCustom: false },
    include: { prices: true },
  });
  if (!newPlan) return { error: true, message: "Plan not found" };

  const price = newPlan.prices.find((p) => p.id === priceId && p.isActive);
  if (!price) return { error: true, message: "Price not found" };

  // get current subscription from stripe
  const subscription = await stripe.subscriptions.retrieve(team.stripeSubscriptionId);
  if (!subscription) return { error: true, message: "Failed to retrieve subscription" };

  const proration = await stripe.invoices.retrieveUpcoming({
    customer: team?.stripeCustomerId,
    subscription: team.stripeSubscriptionId,
    subscription_items: [
      {
        id: subscription.items.data[0].id,
        price: price.stripePriceId,
      },
    ],
    subscription_proration_behavior: "always_invoice",
    subscription_billing_cycle_anchor: "now",
  });

  return proration.amount_due;
};
