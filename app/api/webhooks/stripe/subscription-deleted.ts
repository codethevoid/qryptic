import prisma from "@/db/prisma";
import Stripe from "stripe";
import { Plan } from "@prisma/client";
import { stripe } from "@/utils/stripe";
import { processInvoice } from "@/app/api/webhooks/stripe/utils/process-invoice";

export const subscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const customer = subscription.customer as string;

  // update team with free plan
  const freePlan: Plan = (await prisma.plan.findFirst({
    where: { isFree: true, isCustom: false, isLegacy: false },
  })) as Plan;

  // update team with free plan
  await prisma.team.update({
    where: { stripeCustomerId: customer },
    data: {
      plan: { connect: { id: freePlan.id } },
      stripeSubscriptionId: null,
      subscriptionStatus: "active",
      subscriptionStart: null,
      subscriptionEnd: null,
      failedInvoiceId: null,
      cancelAtPeriodEnd: false,
      trialEndsAt: null,
      paymentMethodId: null,
      type: null,
      brand: null,
      last4: null,
      expMonth: null,
      expYear: null,
    },
  });

  // disconnect price from team
  await prisma.price.update({
    where: { stripePriceId: subscription.items.data[0].price.id },
    data: { teams: { disconnect: { stripeCustomerId: customer } } },
  });

  // delete teams default payment method
  if (subscription.default_payment_method) {
    await stripe.paymentMethods.detach(subscription.default_payment_method as string);
  }

  // get latest invoice and mark as uncollectible
  if (subscription.latest_invoice) {
    const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
    if (latestInvoice.status !== "paid") {
      await stripe.invoices.markUncollectible(latestInvoice.id);
      await processInvoice(latestInvoice, customer);
    }
  }
};
