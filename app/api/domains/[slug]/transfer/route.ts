import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const POST = withTeam(async ({ req, team }) => {
  try {
    const body = await req.json();
    let { name, transferTo, transferLinks } = body;
    if (!name || !transferTo) {
      return NextResponse.json(
        { error: "Domain name and transferTo are required" },
        { status: 400 },
      );
    }

    name = name.toLowerCase().trim();

    // make sure domain exists and belongs to team
    const domain = await prisma.domain.findUnique({
      where: { name, teamId: team.id },
    });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

    // get transferTo team
    const transferToTeam = await prisma.team.findUnique({
      where: { slug: transferTo },
      include: { plan: true, domains: true },
    });
    if (!transferToTeam) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    // check if team has available domain slots
    if (transferToTeam.domains.length >= transferToTeam.plan.domains) {
      return NextResponse.json({ error: "Team has reached max domains" }, { status: 400 });
    }

    // update links and events to new team if transferLinks is true
    if (transferLinks) {
      await prisma.link.updateMany({
        where: { domainId: domain.id },
        data: { teamId: transferToTeam.id },
      });
      await prisma.event.updateMany({
        where: { domainId: domain.id },
        data: { teamId: transferToTeam.id },
      });
    } else {
      // delete links and events
      await prisma.event.deleteMany({ where: { domainId: domain.id } });
      await prisma.link.deleteMany({ where: { domainId: domain.id } });
    }

    // update domain teamId
    await prisma.domain.update({
      where: { id: domain.id },
      data: { teamId: transferToTeam.id, isDefault: transferToTeam.domains.length === 0 },
    });

    // update default domain if domain is default
    if (domain.isDefault) {
      const newDefaultDomain = await prisma.domain.findFirst({
        where: { teamId: team.id, NOT: { name } },
      });
      if (newDefaultDomain) {
        await prisma.domain.update({
          where: { id: newDefaultDomain.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ message: "Domain transferred successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to transfer domain" }, { status: 500 });
  }
});
