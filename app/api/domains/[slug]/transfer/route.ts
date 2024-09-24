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
      include: { plan: true, domains: { where: { isArchived: false } } },
    });
    if (!transferToTeam) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    // check if team has available domain slots
    if (transferToTeam.domains.length >= transferToTeam.plan.domains && !domain.isArchived) {
      return NextResponse.json({ error: "Team has reached max domains" }, { status: 400 });
    }

    // get all links for domain
    const links = await prisma.link.findMany({
      where: { domainId: domain.id, tags: { some: {} } },
      select: { id: true },
    });

    await Promise.all(
      links.map((link) => {
        return prisma.link.update({
          where: { id: link.id },
          data: { tags: { set: [] } }, // Disconnect all tags from each link
        });
      }),
    );

    // update links and events to new team if transferLinks is true
    if (transferLinks) {
      await prisma.$transaction([
        prisma.link.updateMany({
          where: { domainId: domain.id },
          data: { teamId: transferToTeam.id },
        }),
        prisma.event.updateMany({
          where: { domainId: domain.id },
          data: { teamId: transferToTeam.id },
        }),
        prisma.domain.update({
          where: { id: domain.id },
          data: { teamId: transferToTeam.id, isPrimary: transferToTeam.domains.length === 0 },
        }),
      ]);
    } else {
      // delete links and events
      await prisma.$transaction([
        prisma.event.deleteMany({ where: { domainId: domain.id } }),
        prisma.link.deleteMany({ where: { domainId: domain.id } }),
        prisma.domain.update({
          where: { id: domain.id },
          data: { teamId: transferToTeam.id, isPrimary: transferToTeam.domains.length === 0 },
        }),
      ]);
    }

    // update default domain if domain was default
    if (domain.isPrimary) {
      const newPrimaryDomain = await prisma.domain.findFirst({
        where: { teamId: team.id, NOT: { name } },
      });
      if (newPrimaryDomain) {
        await prisma.domain.update({
          where: { id: newPrimaryDomain.id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({ message: "Domain transferred successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to transfer domain" }, { status: 500 });
  }
});
