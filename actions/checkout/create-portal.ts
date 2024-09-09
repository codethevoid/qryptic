"use server";

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { stripe } from "@/utils/stripe";
import { protocol, appDomain } from "@/lib/constants/domains";
import { Stripe } from "stripe";
import { redirect } from "next/navigation";
import { Plan, Price } from "@prisma/client";

type PlanWithPrices = Plan & { prices: Price[] };

export const createPortal = async (slug: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  const team = await prisma.team.findUnique({ where: { slug }, include: { members: true } });
  if (!team) return { error: true, message: "Team not found" };

  const member = team.members.find((member) => member.userId === token.userId);
  if (!member) return { error: true, message: "Not a member of this team" };
  if (!["owner", "super_admin"].includes(member.role)) {
    return { error: true, message: "Not authorized" };
  }

  // get all plans that user can switch to
  const plans: PlanWithPrices[] = await prisma.plan.findMany({
    where: { isFree: false, isCustom: false, isLegacy: false },
    include: { prices: { where: { isActive: true } } },
  });

  if (!plans) return { error: true, message: "Failed to fetch plans" };

  // create config
  const config = await stripe.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: `${protocol}${appDomain}/${slug}/settings/legal/privacy`,
      terms_of_service_url: `${protocol}${appDomain}/${slug}/settings`,
      headline: "Manage your subscription",
    },
    features: {
      subscription_cancel: { enabled: false },
      // subscription_update: {
      //   enabled: true,
      //   default_allowed_updates: ["price"],
      // },
    },
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${protocol}${appDomain}/${slug}/settings/billing`,
  });

  if (!session) return { error: true, message: "Failed to create portal session" };

  redirect(session.url);
};
