"use server";

import { stripe } from "@/utils/stripe";
import prisma from "@/db/prisma";
import { Price, Team, Plan } from "@prisma/client";
import { auth } from "@/auth";
import { appDomain, protocol } from "@/utils/qryptic/domains";

type CreateSessionResponse = {
  error?: boolean;
  url?: string;
  message?: string;
};

const allowedRoles = ["owner", "super_admin"];

export const createCheckoutSession = async (
  price: Price,
  plan: Plan,
  team: Team,
  path: string,
): Promise<CreateSessionResponse> => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // get team from server
  const teamFromServer = await prisma.team.findUnique({
    where: { id: team.id },
    include: { members: { include: { user: true } }, plan: true },
  });

  if (!teamFromServer) return { error: true, message: "Team not found" };

  // make sure user is part of team and is owner or super admin
  const user = teamFromServer.members.find((member) => {
    if (member.userId === token.userId && allowedRoles.includes(member.role)) {
      return member;
    }
  });
  if (!user) return { error: true, message: "Unauthorized" };

  // make sure team is not already on a paid plan
  if (!teamFromServer.plan.isFree) {
    return { error: true, message: "Team is already on a paid plan" };
  }

  // make sure plan and price is valid
  const planFromServer = await prisma.plan.findUnique({
    where: { id: plan.id, isFree: false, isCustom: false, isLegacy: false },
    include: { prices: true },
  });

  if (!planFromServer) return { error: true, message: "Plan not found" };
  if (!planFromServer.prices.find((p) => p.id === price.id && p.isActive)) {
    return { error: true, message: "Price not found" };
  }

  // create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: teamFromServer.stripeCustomerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: price.stripePriceId, quantity: 1 }],
    success_url: `${protocol}${appDomain}/${team.slug}/payment/success`,
    cancel_url: `${protocol}${appDomain}${path}`,
  });

  if (!session || !session.url) {
    return { error: true, message: "Failed to create session" };
  }

  return { url: session.url };

  // if team has used free trial, create checkout session
  // if (user.user.hasUsedTrial) {
  //   // create checkout session
  //   const session = await stripe.checkout.sessions.create({
  //     customer: teamFromServer.stripeCustomerId,
  //     payment_method_types: ["card"],
  //     mode: "subscription",
  //     line_items: [{ price: price.stripePriceId, quantity: 1 }],
  //     success_url: `${protocol}${appDomain}/${team.slug}/payment/success`,
  //     cancel_url: `${protocol}${appDomain}${path}`,
  //   });
  //
  //   if (!session || !session.url) {
  //     return { error: true, message: "Failed to create session" };
  //   }
  //
  //   return { url: session.url };
  // }

  // if team has not used free trial, create trial subscription
  // const subscription = await stripe.subscriptions.create({
  //   customer: teamFromServer.stripeCustomerId,
  //   items: [{ price: price.stripePriceId }],
  //   trial_period_days: 14,
  //   trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
  // });
  //
  // if (!subscription) {
  //   return { error: true, message: "Failed to create subscription" };
  // }
  //
  // // update user to show that they have used the trial
  // await prisma.user.update({
  //   where: { id: user.userId },
  //   data: { hasUsedTrial: true },
  // });
  //
  // // update team in database
  // await prisma.team.update({
  //   where: { id: team.id },
  //   data: {
  //     subscriptionStatus: "trialing",
  //     stripeSubscriptionId: subscription.id,
  //     subscriptionStart: new Date(subscription.current_period_start * 1000),
  //     subscriptionEnd: new Date(subscription.current_period_end * 1000),
  //     trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  //     plan: { connect: { id: plan.id } },
  //     price: { connect: { id: price.id } },
  //   },
  // });
  //
  // return { message: "Trial created successfully" };
};
