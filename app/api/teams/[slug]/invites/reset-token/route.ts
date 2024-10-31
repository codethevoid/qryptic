import { NextResponse } from "next/server";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import { nanoid } from "@/utils/nanoid";
import prisma from "@/db/prisma";

export const GET = withTeamOwner(async ({ team }) => {
  try {
    let inviteToken = nanoid(32);
    while (await prisma.team.findUnique({ where: { inviteToken } })) {
      inviteToken = nanoid(32);
    }

    await prisma.team.update({
      where: { id: team.id },
      data: { inviteToken },
    });

    return NextResponse.json({ message: "Invite link has been reset" });
  } catch (e) {
    console.error("Error resetting team invite token: ", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
