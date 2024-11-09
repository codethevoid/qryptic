import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const PATCH = withTeam(async ({ params, team }) => {
  try {
    const { id: linkId } = params;

    // make sure link belongs to team
    const link = await prisma.link.findFirst({
      where: { id: linkId, teamId: team.id },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // archive link
    await prisma.link.update({
      where: { id: linkId },
      data: { isArchived: true },
    });

    return NextResponse.json({ message: "Link archived" });
  } catch (e) {
    console.error("Error deleting link", e);
    return NextResponse.json({ error: "Error archiving link" }, { status: 500 });
  }
});
