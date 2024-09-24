import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const DELETE = withTeam(async ({ params, team }) => {
  try {
    let { domain: name } = params;
    if (!name) return NextResponse.json({ error: "Domain name is required" }, { status: 400 });
    name = name.toLowerCase().trim();

    const domain = await prisma.domain.findUnique({
      where: { name, teamId: team.id },
    });

    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

    const removed = await removeDomain(name);
    if (!removed) return NextResponse.json({ error: "Failed to remove domain" }, { status: 500 });

    // check if domain is primary domain
    if (domain.isPrimary) {
      // update team with new primary domain
      const newPrimaryDomain = await prisma.domain.findFirst({
        where: { teamId: team.id, isArchived: false, NOT: { name } },
      });
      if (newPrimaryDomain) {
        await prisma.domain.update({
          where: { id: newPrimaryDomain.id },
          data: { isPrimary: true },
        });
      }
    }

    // delete events, links, and domain
    await prisma.$transaction([
      prisma.event.deleteMany({ where: { domainId: domain.id } }),
      prisma.link.deleteMany({ where: { domainId: domain.id } }),
      prisma.domain.delete({ where: { name } }),
    ]);

    return NextResponse.json({ message: "Domain removed" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to remove domain" }, { status: 500 });
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
