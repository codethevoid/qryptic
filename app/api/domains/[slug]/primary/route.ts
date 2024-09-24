import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const PATCH = withTeam(async ({ req, team }) => {
  try {
    const body = await req.json();
    let { name } = body;
    if (!name) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    name = name.toLowerCase().trim();

    // make sure domain exists and belongs to team
    const domain = await prisma.domain.findUnique({
      where: { name, teamId: team.id },
    });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

    await prisma.$transaction([
      // unset existing primary domain (should be only one)
      // we will make it updateMany just in case
      prisma.domain.updateMany({
        where: { teamId: team.id, isPrimary: true },
        data: { isPrimary: false },
      }),
      // set domain as primary
      prisma.domain.update({ where: { id: domain.id }, data: { isPrimary: true } }),
    ]);

    return NextResponse.json({ message: "Domain set as primary" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to set primary domain" }, { status: 500 });
  }
});
