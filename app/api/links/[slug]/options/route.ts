import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async ({ team }) => {
  try {
    const [tags, domains] = await prisma.$transaction([
      prisma.tag.findMany({
        where: { teamId: team.id },
        select: { id: true, name: true, color: true },
      }),
      prisma.domain.findMany({
        where: {
          OR: [{ teamId: team.id }, { enabledTeams: { some: { id: team.id } } }],
          isArchived: false,
          isVerified: true,
        },
        select: { id: true, name: true, isPrimary: true },
      }),
    ]);

    return NextResponse.json({ tags, domains });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
