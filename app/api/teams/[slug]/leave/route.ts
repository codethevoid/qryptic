import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import { redis } from "@/lib/upstash/redis";

// This endpoint is for leaving the team from the team settings page
// so only owners can leave the team using this endpoint
export const DELETE = withTeamOwner(async ({ team, user: member }) => {
  try {
    // get all the owners of the team
    // and make sure there will be other owners left in the team
    const owners = await prisma.teamMember.findMany({
      where: { teamId: team.id, role: "owner", id: { not: member.id } },
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

    // delete the team member
    await prisma.teamMember.delete({ where: { id: member.id } });

    // check if this team was the users default team
    const defaultTeam = await redis.get(`user:${member.userId}:defaultTeam`);

    if (defaultTeam === team.slug) {
      // either remove or update the default team (if the user is part of other teams)
      const teams = await prisma.teamMember.findMany({
        where: { userId: member.userId },
        select: { team: { select: { slug: true } } },
      });

      // set the default team to the first team the user is part of
      if (teams.length > 0) {
        // update user's default team
        await redis.set(`user:${member.userId}:defaultTeam`, teams[0].team.slug);
      } else {
        // remove the default team
        await redis.del(`user:${member.userId}:defaultTeam`);
      }
    }

    return NextResponse.json({ message: "Successfully left the team" });
  } catch (e) {
    console.error("Error leaving team: ", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
