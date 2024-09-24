import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const PATCH = withTeam(async ({ req, team }) => {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const domain = await prisma.domain.findUnique({
      where: { name, teamId: team.id },
    });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

    // archive domain
    const { isPrimary } = domain;

    await prisma.domain.update({
      where: { id: domain.id },
      data: { isArchived: true, isPrimary: false },
    });

    // if domain was primary, set another domain as primary
    if (isPrimary) {
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

    return NextResponse.json({ message: "Domain archived successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to archive domain" }, { status: 500 });
  }
});
