import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeamOwner } from "@/lib/auth/with-team-owner";

export const DELETE = withTeamOwner(async ({ team, params }) => {
  try {
    const memberId = params.id;

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    // make sure member is part of the team
    const member = await prisma.teamMember.findFirst({
      where: { id: memberId, teamId: team.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // delete member
    await prisma.teamMember.delete({ where: { id: memberId } });

    return NextResponse.json({ message: "Member has been removed" });
  } catch (e) {
    console.error("Failed to remove member: ", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
