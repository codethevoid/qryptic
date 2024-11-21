import prisma from "@/db/prisma";
import Stripe from "stripe";
import { Plan } from "@prisma/client";
import { stripe } from "@/utils/stripe";
import { processInvoice } from "@/app/api/webhooks/stripe/utils/process-invoice";
import { redis } from "@/lib/upstash/redis";

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
      paymentMethodType: null,
      paymentMethodBrand: null,
      paymentMethodLast4: null,
      paymentMethodExpMonth: null,
      paymentMethodExpYear: null,
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

  // update all users in team default team
  const members = await prisma.teamMember.findMany({
    where: { team: { stripeCustomerId: customer } },
    select: { id: true, userId: true, role: true },
  });

  // get owner of team
  const team = await prisma.team.findUnique({ where: { stripeCustomerId: customer } });
  let owner = team?.createdBy;

  // delete all members except for owner if they are still in the team and an owner
  const isOwnerStillActive = members.some(
    (member) => member.userId === owner && member.role === "owner",
  );

  if (!isOwnerStillActive) {
    // set owner to one of the other member with the role of owner
    owner = members.find((member) => member.role === "owner")?.userId;
  }

  for (const member of members) {
    if (member.userId !== owner) {
      await prisma.teamMember.delete({ where: { id: member.id } });
      // get teams user is apart of and update default team
      const teams = await prisma.teamMember.findMany({
        where: { userId: member.userId },
        include: { team: true },
      });
      if (teams.length === 0) {
        await redis.del(`user:${member.userId}:defaultTeam`);
      } else {
        const defaultTeam = teams[0].team.slug;
        await redis.set(`user:${member.userId}:defaultTeam`, defaultTeam);
      }
    }
  }
};
