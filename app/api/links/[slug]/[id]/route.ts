import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const GET = withTeam(async ({ team, params }) => {
  try {
    const { id } = params;

    const link = await prisma.link.findUnique({
      where: { id, teamId: team.id },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ link });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
