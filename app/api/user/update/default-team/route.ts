import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { redis } from "@/lib/upstash/redis";

export const PATCH = withSession(async ({ user, req }) => {
  try {
    const body = await req.json();
    const { newDefaultTeam } = body; // team slug

    if (!newDefaultTeam) {
      return NextResponse.json({ error: "Please select a default team" }, { status: 400 });
    }

    // make sure the user is part of the new default team
    const member = await prisma.teamMember.findFirst({
      where: { userId: user.id, team: { slug: newDefaultTeam } },
    });

    if (!member) {
      return NextResponse.json({ error: "User is not part of the selected team" }, { status: 400 });
    }

    await redis.set(`user:${user.id}:defaultTeam`, newDefaultTeam);

    return NextResponse.json({ message: "Default team has been updated" });
  } catch (e) {
    console.error("Error updating default team: ", e);
    return NextResponse.json({ error: "Error updating default team" }, { status: 500 });
  }
});
