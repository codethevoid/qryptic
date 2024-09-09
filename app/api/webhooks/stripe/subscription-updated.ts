import prisma from "@/db/prisma";
import Stripe from "stripe";

export const subscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const customer = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;

  // get price and plan
  const price = await prisma.price.findUnique({
    where: { stripePriceId: priceId },
    include: { plan: true },
  });

  if (!price) {
    console.log(`Plan not found for price ${priceId}`);
    return;
  }

  // update team with new plan
  await prisma.team.update({
    where: { stripeCustomerId: customer },
    data: {
      plan: { connect: { id: price.plan.id } },
      price: { connect: { id: price.id } },
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionStart: new Date(subscription.current_period_start * 1000),
      subscriptionEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });
};
