import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import { redis } from "@/lib/upstash/redis";

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

    // check if this team was the member's default team
    const defaultTeam = await redis.get(`user:${member.userId}:defaultTeam`);
    if (defaultTeam === team.slug) {
      // get user's teams and set the first team as default
      const teams = await prisma.teamMember.findMany({
        where: { userId: member.userId },
        select: { team: { select: { slug: true } } },
      });

      if (teams.length) {
        await redis.set(`user:${member.userId}:defaultTeam`, teams[0].team.slug);
      } else {
        // if user has no other teams, remove default team key
        await redis.del(`user:${member.userId}:defaultTeam`);
      }
    }

    return NextResponse.json({ message: "Member has been removed" });
  } catch (e) {
    console.error("Failed to remove member: ", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
