import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const PATCH = withTeam(async ({ team, req, params }) => {
  try {
    const { enabled } = await req.json();
    const { id } = params;

    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain) {
      return NextResponse.json({ message: "Domain not found" }, { status: 404 });
    }

    if (!domain.isDefault) {
      return NextResponse.json({ message: "Domain is not default" }, { status: 400 });
    }

    const teamData = await prisma.team.findUnique({
      where: { id: team.id },
      include: { plan: true },
    });
    if (teamData?.plan.isFree && domain.isExclusive) {
      return NextResponse.json({ message: "You cannot update this domain" }, { status: 400 });
    }

    if (enabled) {
      await prisma.domain.update({
        where: { id },
        data: { enabledTeams: { connect: { id: team.id } } },
      });
    } else {
      await prisma.domain.update({
        where: { id },
        data: { enabledTeams: { disconnect: { id: team.id } } },
      });
    }

    return NextResponse.json({ message: "Domain updated" }, { status: 200 });
  } catch (e) {
    console.error("Error updating default domain: ", e);
    return NextResponse.json({ message: "Error updating default domain" }, { status: 500 });
  }
});
