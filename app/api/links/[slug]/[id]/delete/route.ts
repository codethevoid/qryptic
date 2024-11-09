import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const DELETE = withTeam(async ({ params, team }) => {
  try {
    const { id: linkId } = params;

    // make sure link belongs to team
    const link = await prisma.link.findFirst({
      where: { id: linkId, teamId: team.id },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // delete events, associated with links
    // along with all links
    await prisma.$transaction([
      prisma.event.deleteMany({ where: { linkId } }),
      prisma.link.delete({ where: { id: linkId } }),
    ]);

    return NextResponse.json({ message: "Link deleted" });
  } catch (e) {
    console.error("Failed to delete link", e);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
});
