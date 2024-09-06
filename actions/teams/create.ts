"use server";

import { auth } from "@/auth";
import { keywords } from "@/utils/keywords";
import prisma from "@/db/prisma";
import { nanoid } from "@/utils/nanoid";
import type { Plan } from "@prisma/client";
import { stripe } from "@/utils/stripe";

type CreateTeamResponse = {
  error: boolean;
  message?: string;
  slug?: string;
};

export const createTeam = async (name: string): Promise<CreateTeamResponse> => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // check name
  if (!name || name.length < 1) return { error: true, message: "Please enter a team name" };
  if (name.length > 28)
    return { error: true, message: "Team name must be no more than 28 characters" };

  // check keywords
  if (keywords.some((k) => name.toLowerCase().trim() === k)) {
    return { error: true, message: "Team name contains a restricted word" };
  }

  // get user
  const user = await prisma.user.findUnique({
    where: { id: token.userId },
    select: { email: true },
  });
  if (!user) return { error: true, message: "Unauthorized" };

  // check if user can create a team (max 1 team for free plan)
  const teams = await prisma.teamMember.findMany({
    where: { userId: token.userId, role: "super_admin" },
    include: {
      team: {
        select: { plan: true },
      },
    },
  });

  const freeTeams = teams.filter((t) => t.team.plan.isFree);
  if (freeTeams.length >= 1) {
    return { error: true, message: "You have reached the limit of free teams" };
  }

  // create team
  // get default free plan
  const freePlan = (await prisma.plan.findFirst({
    where: { isFree: true, isCustom: false, isLegacy: false },
  })) as Plan;

  // generate slug for team and make sure it is url safe
  let isSlugGenerated = false;
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    slug = nanoid(8);
    isSlugGenerated = true;
  }

  // check if slug is already in use
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

  const team = await prisma.team.create({
    data: {
      name,
      slug,
      createdBy: token.userId,
      planId: freePlan.id,
      stripeCustomerId: customer.id,
      subscriptionStatus: "active",
    },
  });

  // create team member
  await prisma.teamMember.create({
    data: {
      userId: token.userId,
      teamId: team.id,
      role: "super_admin",
    },
  });

  // update user with default team
  await prisma.user.update({
    where: { id: token.userId },
    data: { defaultTeam: team.slug },
  });

  // we return the slug so we can update the jwt with the team slug
  // and so we can redirect the user to the slug
  return { error: false, slug: team.slug };
};
