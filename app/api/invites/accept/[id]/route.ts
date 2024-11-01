import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { redis } from "@/lib/upstash/redis";

type Body = {
  teamId: string;
};

export const POST = withSession(async ({ req, params, user }) => {
  try {
    const inviteId = params.id;
    const body = (await req.json()) as Body;

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const { email, teamId } = invite;
    if (email !== user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (teamId !== body.teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        _count: { select: { members: true } },
        plan: { select: { seats: true } },
        slug: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const { seats } = team.plan;
    const { members: currentMembers } = team._count;

    if (currentMembers >= seats) {
      return NextResponse.json({ error: "Team seats are full" }, { status: 400 });
    }

    // check if user is already a member of the team
    const isCurrMember = await prisma.teamMember.findFirst({
      where: { teamId, userId: user.id },
    });

    if (isCurrMember) {
      // delete invite
      await prisma.invite.delete({ where: { id: inviteId } });
      return NextResponse.json({ error: "User is already a member of the team" }, { status: 400 });
    }

    // create team member and delete invite
    await prisma.$transaction([
      prisma.invite.delete({ where: { id: inviteId } }),
      prisma.teamMember.create({
        data: {
          teamId,
          userId: user.id,
          role: invite.role,
        },
      }),
    ]);

    // check if user has default team and if this is their first team joining
    if (!user.defaultTeam) {
      // set default team as this team
      await redis.set(`user:${user.id}:defaultTeam`, team.slug);
    } else {
      // check if their current default team is still valid
      const currDefaultTeam = await prisma.teamMember.findFirst({
        where: { team: { slug: user.defaultTeam }, userId: user.id },
      });
      if (!currDefaultTeam) {
        // set default team as this team
        await redis.set(`user:${user.id}:defaultTeam`, team.slug);
      }
    }

    return NextResponse.json({ message: "Invite accepted" });
  } catch (e) {
    console.log("Error accepting invite: ", e);
    return NextResponse.json({ error: "Error accepting invite" }, { status: 500 });
  }
});
