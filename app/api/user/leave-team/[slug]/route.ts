import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withSession } from "@/lib/auth/with-session";
import { redis } from "@/lib/upstash/redis";

export const DELETE = withSession(async ({ params, user }) => {
  try {
    const { slug } = params; // team slug that user wants to leave

    // find member in team
    const member = await prisma.teamMember.findFirst({
      where: { userId: user.id, team: { slug } },
    });

    if (!member) {
      return NextResponse.json({ error: "You are not a member of this team" }, { status: 400 });
    }

    // if member role is not owner, allow to leave team
    if (member.role !== "owner") {
      await prisma.teamMember.delete({ where: { id: member.id } });

      // check if this team was the users default team
      // and update default team in redis accordingly
      if (user.defaultTeam === slug) {
        await updateDefaultTeam(user.id);
      }
      return NextResponse.json({ message: "Successfully left the team" });
    }

    // if member role is owner, check if there are other owners in team
    const owners = await prisma.teamMember.findMany({
      where: { team: { slug }, role: "owner", id: { not: member.id } },
    });

    if (owners.length === 0) {
      return NextResponse.json(
        {
          error:
            "You can't leave the team because you are the only owner. Please delete the team instead.",
        },
        { status: 400 },
      );
    }

    // if there are other owners, allow to leave team
    await prisma.teamMember.delete({ where: { id: member.id } });

    // check if this team was the users default team
    if (user.defaultTeam === slug) {
      await updateDefaultTeam(user.id);
    }

    return NextResponse.json({ message: "Successfully left the team" });
  } catch (e) {
    console.error("Error leaving team: ", e);
    return NextResponse.json({ error: "Failed to leave team" }, { status: 500 });
  }
});

async function updateDefaultTeam(id: string) {
  try {
    const teams = await prisma.teamMember.findMany({
      where: { userId: id },
      select: { team: { select: { slug: true } } },
    });

    if (teams.length > 0) {
      // update default team in redis with first team user is part of
      await redis.set(`user:${id}:defaultTeam`, teams[0].team.slug);
    } else {
      // remove default team from redis
      await redis.del(`user:${id}:defaultTeam`);
    }
  } catch (e) {
    console.error("Error updating default team: ", e);
  }
}
