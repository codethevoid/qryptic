import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";

export const DELETE = withSession(async ({ user, params }) => {
  try {
    const inviteId = params.id;
    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.email !== user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // delete invite
    await prisma.invite.delete({ where: { id: inviteId } });

    return NextResponse.json({ message: "Invite has been declined" });
  } catch (e) {
    console.log("Error declining invite: ", e);
    return NextResponse.json({ error: "Error declining invite" }, { status: 500 });
  }
});
