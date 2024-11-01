import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { redis } from "@/lib/upstash/redis";

export const POST = withSession(async ({ req, user, params }) => {
  try {
    const { token } = params;

    const team = await prisma.team.findUnique({
      where: { inviteToken: token },
      select: {
        id: true,
        slug: true,
        members: { select: { userId: true } },
        invites: { select: { id: true, email: true, role: true } },
        plan: { select: { seats: true } },
        _count: { select: { members: true } },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const { members, invites, plan } = team;
    const { seats } = plan;
    const currSeats = team._count.members;

    if (currSeats >= seats) {
      return NextResponse.json({ error: "Team seats are full" }, { status: 400 });
    }

    // check if user has an active invite for the team
    // if there is, we will delete it after adding the user to the team
    const isInvited = invites.find((i) => i.email === user.email);
    const isMember = members.find((m) => m.userId === user.id);
    if (isMember) {
      return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 });
    }

    // create team member for team
    // if there is an invite, we will use the role from the invite
    // otherwise, we will use the default role of member
    const role = isInvited ? isInvited.role : "member";
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role,
      },
    });

    // delete invite if it exists
    if (isInvited) {
      await prisma.invite.delete({ where: { id: isInvited.id } });
    }

    // update user with default team if they don't have one
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

    return NextResponse.json({ message: "Successfully joined team" });
  } catch (e) {
    console.error("Error joining team: ", e);
    return NextResponse.json({ error: "Failed to join team" }, { status: 500 });
  }
});
