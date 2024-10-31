import { NextResponse } from "next/server";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import prisma from "@/db/prisma";

export const DELETE = withTeamOwner(async ({ team, params }) => {
  try {
    const inviteId = params.id;
    if (!inviteId) {
      return NextResponse.json({ error: "Invite ID is required" }, { status: 400 });
    }

    // make sure invite is part of the team
    const invite = await prisma.invite.findFirst({
      where: { id: inviteId, teamId: team.id },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    await prisma.invite.delete({ where: { id: inviteId } });

    return NextResponse.json({ message: "Invite has been revoked" });
  } catch (e) {
    console.error("Failed to revoke invite: ", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
