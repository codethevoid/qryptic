"use server";

import { auth } from "@/auth";
import { verifyOwnership } from "@/lib/auth/verify-ownership";
import { stripe } from "@/utils/stripe";
import prisma from "@/db/prisma";

export const resumePlan = async (slug: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // verify ownership of team
  const { isAuthorized, team } = await verifyOwnership(slug, token.userId);
  if (!isAuthorized) return { error: true, message: "Unauthorized" };

  if (!team?.stripeSubscriptionId) return { error: true, message: "No subscription found" };

  // cancel subscription
  await stripe.subscriptions.update(team?.stripeSubscriptionId as string, {
    cancel_at_period_end: false,
  });

  await prisma.team.update({ where: { id: team.id }, data: { cancelAtPeriodEnd: false } });

  return { message: "Plan canceled successfully" };
};
