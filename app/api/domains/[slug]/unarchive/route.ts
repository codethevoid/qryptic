import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const PATCH = withTeam(async ({ team, req }) => {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const domain = await prisma.domain.findUnique({
      where: { name, teamId: team.id },
    });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

    // check if team can unarchive domain
    const teamWithPlan = await prisma.team.findUnique({
      where: { id: team.id },
      select: { plan: true, domains: { where: { isArchived: false } } },
    });
    if (!teamWithPlan) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (teamWithPlan?.domains.length >= teamWithPlan.plan.domains) {
      return NextResponse.json(
        {
          error: `You can only have ${teamWithPlan.plan.domains} domain${teamWithPlan.plan.domains === 1 ? "" : "s"} on your current plan.`,
        },
        { status: 403 },
      );
    }

    // unarchive domain
    await prisma.domain.update({
      where: { id: domain.id },
      data: { isArchived: false },
    });

    // check if team has a primary domain
    const primaryDomain = await prisma.domain.findFirst({
      where: { teamId: team.id, isPrimary: true, isArchived: false },
    });

    if (!primaryDomain) {
      await prisma.domain.update({
        where: { id: domain.id },
        data: { isPrimary: true },
      });
    }

    return NextResponse.json({ message: "Domain unarchived successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to unarchive domain" }, { status: 500 });
  }
});
