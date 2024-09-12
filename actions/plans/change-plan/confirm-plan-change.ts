"use server";

import { verifyOwnership } from "@/lib/auth/verify-ownership";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { stripe } from "@/utils/stripe";
import Stripe from "stripe";

export const confirmPlanChange = async (slug: string, newPlanId: string, priceId: string) => {
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

  // update subscription in stripe
  await stripe.subscriptions.update(team.stripeSubscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: price.stripePriceId,
      },
    ],
    billing_cycle_anchor: "now",
    proration_behavior: "always_invoice",
  });

  const customer = (await stripe.customers.retrieve(
    subscription.customer as string,
  )) as Stripe.Customer;
  if (!customer) return { error: true, message: "Failed to retrieve customer" };

  if (customer?.balance < 50 && customer?.balance > 0) {
    await stripe.customers.update(customer.id, { balance: 0 });
  }

  // update user plan in database
  // we will just update plan and price here, and let webhook handle the rest
  await prisma.team.update({
    where: { id: team?.id },
    data: {
      plan: { connect: { id: newPlan.id } },
      price: { connect: { id: price.id } },
    },
  });

  return { message: "Plan changes successfully" };
};
