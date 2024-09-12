"use server";

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { stripe } from "@/utils/stripe";
import { verifyOwnership } from "@/lib/auth/verify-ownership";
import { Stripe } from "stripe";

export const addCard = async (slug: string, paymentMethodId: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  const { isAuthorized, team } = await verifyOwnership(slug, token.userId);
  if (!isAuthorized) return { error: true, message: "Unauthorized" };

  // detach old card from team
  if (team?.paymentMethodId) await stripe.paymentMethods.detach(team?.paymentMethodId);

  // update team subscription to use new card
  await stripe.subscriptions.update(team?.stripeSubscriptionId as string, {
    default_payment_method: paymentMethodId,
  });

  // check if team has a failed invoice and pay it
  if (team?.failedInvoiceId) await stripe.invoices.pay(team?.failedInvoiceId);

  // retrieve payment method from stripe
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  // update team in db with updated card
  const { brand, last4, exp_month, exp_year } = paymentMethod.card as Stripe.PaymentMethod.Card;

  await prisma.team.update({
    where: { id: team?.id },
    data: {
      subscriptionStatus: "active", // optimistic update to prevent user from seeing past due status after updating card
      paymentMethodId,
      paymentMethodBrand: brand,
      paymentMethodLast4: last4,
      paymentMethodExpMonth: exp_month,
      paymentMethodExpYear: exp_year,
    },
  });

  return { message: "Card added successfully" };
};
