import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const PATCH = withTeam(async ({ req, team }) => {
  try {
    const body = await req.json();
    let { destination, name } = body;

    if (!name) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const domain = await prisma.domain.findUnique({
      where: { teamId: team.id, name },
    });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

    // check if team can create destination (has to be pro plan)
    const teamWithPlan = await prisma.team.findUnique({
      where: { id: team.id },
      select: { plan: true },
    });

    // update domain
    await prisma.domain.update({
      where: { id: domain.id },
      data: {
        destination: teamWithPlan?.plan.isFree
          ? domain.destination // keep the same destination if free plan (should be null)
          : destination?.toLowerCase().trim() || null, // set destination if not free plan
      },
    });

    return NextResponse.json({ message: "Domain edited successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to edit domain" }, { status: 500 });
  }
});
