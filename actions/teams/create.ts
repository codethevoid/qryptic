"use server";

import { auth } from "@/auth";
import { keywords } from "@/lib/constants/keywords";
import prisma from "@/db/prisma";
import { nanoid } from "@/utils/nanoid";
import type { Plan } from "@prisma/client";
import { stripe } from "@/utils/stripe";

type CreateTeamResponse = {
  error: boolean;
  message?: string;
  description?: string;
  slug?: string;
};

export const createTeam = async (name: string): Promise<CreateTeamResponse> => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // check name
  if (!name || name.length < 1) return { error: true, message: "Please enter a team name" };
  if (name.length > 28)
    return { error: true, message: "Team name must be no more than 28 characters" };

  // get user
  const user = await prisma.user.findUnique({
    where: { id: token.userId },
    select: { email: true },
  });
  if (!user) return { error: true, message: "Unauthorized" };

  // get all teams that user is super admin of and check if they have a free team
  const teams = await prisma.teamMember.findMany({
    where: { userId: token.userId, role: "super_admin" },
    include: { team: { include: { plan: true } } },
  });

  // if user has a free team, they can't create another
  const freeTeams = teams.filter((t) => t.team.plan.isFree);
  if (freeTeams.length >= 2) {
    return {
      error: true,
      description: `You can only have two teams on a free plan. Either upgrade or delete your existing free teams to create a new one.`,
    };
  }

  // check if user has an active trial without a payment method
  // const activeTrials = teams.filter((t) => {
  //   const hasPaymentMethod = !!t.team.paymentMethodId;
  //   const status = t.team.subscriptionStatus;
  //   return status === "trialing" && !hasPaymentMethod;
  // });
  // if (activeTrials.length > 0) {
  //   return {
  //     error: true,
  //     description: `You have an active trial on team ${activeTrials[0].team.name} without a payment method. Please create a payment method before creating another team.`,
  //   };
  // }

  // check if any trials are getting cancelled at period end
  // const trialsGettingCancelled = teams.filter((t) => {
  //   const status = t.team.subscriptionStatus;
  //   const cancelAtPeriodEnd = t.team.cancelAtPeriodEnd;
  //   return status === "trialing" && cancelAtPeriodEnd;
  // });
  // if (trialsGettingCancelled.length > 0) {
  //   return {
  //     error: true,
  //     description: `You have an active trial on team ${trialsGettingCancelled[0].team.name} that is getting downgraded to a free plan at the end of the trial period. You can't have more than one free team.`,
  //   };
  // }

  // create team
  // get default free plan
  const freePlan = (await prisma.plan.findFirst({
    where: { isFree: true, isCustom: false, isLegacy: false },
  })) as Plan;

  // generate [slug] for team and make sure it is url safe
  let isSlugGenerated = false;
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    slug = nanoid(8);
    isSlugGenerated = true;
  }

  // check keywords
  if (keywords.some((k) => k.toLowerCase().trim() === slug)) {
    return { error: true, message: "Team name contains a reserved word" };
  }

  // check if [slug] is already in use
  while (await prisma.team.findUnique({ where: { slug } })) {
    if (isSlugGenerated) {
      slug = nanoid(8);
    } else {
      slug = `${slug}-${nanoid(4)}`;
    }
  }

  // create customer in stripe for team
  const customer = await stripe.customers.create({
    name,
    email: user.email,
  });

  // get gradient avatar
  // generate random number from 0-63
  const randNum = Math.floor(Math.random() * 64);
  const key = `gradients/${randNum}.png`;

  // get default domains
  const defaultDomains = await prisma.domain.findMany({
    where: { isDefault: true },
  });

  const team = await prisma.team.create({
    data: {
      name,
      slug,
      createdBy: token.userId,
      planId: freePlan.id,
      stripeCustomerId: customer.id,
      subscriptionStatus: "active",
      image: `https://qryptic.s3.amazonaws.com/${key}`,
      defaultDomains: { connect: defaultDomains.map((d) => ({ id: d.id })) },
    },
  });

  // create team member
  await prisma.teamMember.create({
    data: {
      userId: token.userId,
      teamId: team.id,
      role: "owner",
    },
  });

  // update user with default team
  await prisma.user.update({
    where: { id: token.userId },
    data: { defaultTeam: team.slug },
  });

  // we return the [slug] so we can update the jwt with the team [slug]
  // and so we can redirect the user to the [slug]
  return { error: false, slug: team.slug };
};
