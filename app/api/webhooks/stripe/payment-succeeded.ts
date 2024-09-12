import { stripe } from "@/utils/stripe";
import prisma from "@/db/prisma";
import Stripe from "stripe";
import { processInvoice } from "@/app/api/webhooks/stripe/utils/process-invoice";

export const paymentSucceeded = async (invoice: Stripe.Invoice) => {
  const customer = invoice.customer;
  const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );

  // get payment method details
  const paymentMethodId = subscription.default_payment_method;
  let paymentMethod: Stripe.PaymentMethod | null = null;
  if (paymentMethodId) {
    paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId as string);
  }

  // update team in db
  await prisma.team.update({
    where: { stripeCustomerId: customer as string },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: "active",
      subscriptionStart: new Date(subscription.current_period_start * 1000),
      subscriptionEnd: new Date(subscription.current_period_end * 1000),
      paymentMethodId: paymentMethod?.id || null,
      paymentMethodType: paymentMethod?.type || null,
      paymentMethodBrand: paymentMethod?.card?.brand || null,
      paymentMethodLast4: paymentMethod?.card?.last4 || null,
      paymentMethodExpMonth: paymentMethod?.card?.exp_month || null,
      paymentMethodExpYear: paymentMethod?.card?.exp_year || null,
      failedInvoiceId: null,
    },
  });

  // create or update invoice in db
  await processInvoice(invoice, customer as string);
};
