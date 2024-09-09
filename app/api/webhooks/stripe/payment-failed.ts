import { stripe } from "@/utils/stripe";
import Stripe from "stripe";
import prisma from "@/db/prisma";
import { processInvoice } from "@/app/api/webhooks/stripe/utils/process-invoice";

export const paymentFailed = async (invoice: Stripe.Invoice) => {
  const customer = invoice.customer;
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

  // update team in db
  await prisma.team.update({
    where: { stripeCustomerId: customer as string },
    data: {
      subscriptionStatus: subscription.status,
      failedInvoiceId: invoice.id,
    },
  });

  // create or update invoice in db
  await processInvoice(invoice, customer as string);
};
