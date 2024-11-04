import { NextResponse } from "next/server";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import prisma from "@/db/prisma";
import { stripe } from "@/utils/stripe";
import { redis } from "@/lib/upstash/redis";

export const DELETE = withTeamOwner(async ({ team }) => {
  try {
    // delete subscription from stripe
    // delete all team members
    // update members default team to another team
    // delete team invites
    // delete events
    // delete links
    // delete tags
    // remove custom domains from vercel
    // delete custom domains from db
    // delete invoices
    // delete team from db

    const teamData = await prisma.team.findUnique({
      where: { id: team.id },
      include: { plan: true, members: { include: { user: true } }, domains: true },
    });

    if (!teamData) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const { members, domains } = teamData;

    await prisma.$transaction([
      prisma.event.deleteMany({ where: { teamId: team.id } }),
      prisma.invite.deleteMany({ where: { teamId: team.id } }),
      prisma.qrCode.deleteMany({ where: { link: { teamId: team.id } } }),
      prisma.link.deleteMany({ where: { teamId: team.id } }),
      prisma.tag.deleteMany({ where: { teamId: team.id } }),
      prisma.domain.deleteMany({ where: { teamId: team.id } }),
      prisma.teamMember.deleteMany({ where: { teamId: team.id } }),
      prisma.invoice.deleteMany({ where: { teamId: team.id } }),
      prisma.team.delete({ where: { id: team.id } }),
    ]);

    // remove custom domains from vercel
    for (const domain of domains) {
      try {
        await removeDomain(domain.name);
      } catch {
        console.error("Error removing domain from Vercel: ", domain.name);
      }
    }

    // update member default team to another team
    for (const member of members) {
      try {
        await updateMemberDefaultTeam(member.userId, team.slug);
      } catch {
        console.error("Error updating member default team: ", member.userId);
      }
    }

    const { stripeSubscriptionId } = teamData;
    if (stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
      if (invoice?.status === "open") {
        await stripe.invoices.markUncollectible(invoice.id);
      }

      // cancel subscription
      await stripe.subscriptions.cancel(stripeSubscriptionId);
    }

    return NextResponse.json({ message: "Team has been deleted" });
  } catch (e) {
    console.error("Error deleting team: ", e);
    return NextResponse.json({ error: "Error deleting team" }, { status: 500 });
  }
});

async function removeDomain(name: string) {
  try {
    // DELETE /v9/projects/{idOrName}/domains/{domain}
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${name}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}` },
      },
    );

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function updateMemberDefaultTeam(userId: string, teamSlug: string) {
  try {
    const defaultTeam = await redis.get(`user:${userId}:defaultTeam`);
    if (defaultTeam === teamSlug) {
      const userTeams = await prisma.teamMember.findMany({
        where: { userId },
        select: { team: { select: { slug: true } } },
      });

      if (userTeams.length) {
        const newDefaultTeam = userTeams[0].team.slug;
        await redis.set(`user:${userId}:defaultTeam`, newDefaultTeam);
      } else {
        await redis.del(`user:${userId}:defaultTeam`);
      }
    }
  } catch (e) {
    console.error("Error updating member default team: ", e);
  }
}
