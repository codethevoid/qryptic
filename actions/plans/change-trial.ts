"use server";

import { Price, Plan, TeamMember, Team } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { stripe } from "@/utils/stripe";
import { PlanWithPrices } from "@/types/plans";

type CustomTeam = Team & { members: TeamMember[]; plan: Plan };

export const changeTrial = async (priceId: string, planId: string, teamId: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // get team from server
  const team: CustomTeam | null = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true, plan: true },
  });
  if (!team) return { error: true, message: "Team not found" };
  if (team.subscriptionStatus !== "trialing")
    return { error: true, message: "Team is not on a trial" };

  // make sure user is part of team and is owner or super admin
  const user = team.members.find((member) => member.userId === token.userId) as TeamMember;
  if (!user) return { error: true, message: "Unauthorized" };
  if (!["owner", "super_admin"].includes(user.role))
    return { error: true, message: "Unauthorized" };

  // make sure team is trialing
  if (team.subscriptionStatus !== "trialing") {
    return { error: true, message: "Team is not on an active trial" };
  }

  // make sure plan and price is valid
  const plan: PlanWithPrices | null = await prisma.plan.findUnique({
    where: { id: planId },
    include: { prices: true },
  });
  if (!plan) return { error: true, message: "Plan not found" };
  const price = plan.prices.find((p) => p.id === priceId && p.isActive);
  if (!price) return { error: true, message: "Price not found" };

  // get current subscription from stripe
  const currSubscription = await stripe.subscriptions.retrieve(team.stripeSubscriptionId as string);
  if (!currSubscription) return { error: true, message: "Failed to retrieve subscription" };

  const itemId = currSubscription.items.data[0].id;

  // update team's subscription
  const subscription = await stripe.subscriptions.update(team.stripeSubscriptionId as string, {
    items: [{ id: itemId, price: price.stripePriceId }],
  });
  if (!subscription) return { error: true, message: "Failed to update subscription" };

  // update team in db
  await prisma.team.update({
    where: { id: team.id },
    data: {
      plan: { connect: { id: plan.id } },
      price: { connect: { id: price.id } },
      subscriptionStatus: subscription.status,
      stripeSubscriptionId: subscription.id,
      subscriptionStart: new Date(subscription.current_period_start * 1000),
      subscriptionEnd: new Date(subscription.current_period_end * 1000),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });

  return { message: "Trial changed successfully" };
};
