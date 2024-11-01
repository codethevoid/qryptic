import { NextResponse } from "next/server";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import { sendEmail } from "@/utils/send-email";
import prisma from "@/db/prisma";
import { InviteEmail } from "@/emails/invite";
import { protocol, appDomain } from "@/utils/qryptic/domains";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.literal("owner").or(z.literal("member")),
});

type Body = {
  email: string;
  role: "owner" | "member";
};

export const POST = withTeamOwner(async ({ team, req }) => {
  try {
    const body = (await req.json()) as Body;
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    try {
      inviteSchema.parse({ email, role });
    } catch {
      return NextResponse.json({ error: "Invalid email or role" }, { status: 400 });
    }

    const teamData = await prisma.team.findUnique({
      where: { id: team.id },
      select: {
        name: true,
        plan: { select: { seats: true } },
        members: { select: { user: { select: { email: true } } } },
        invites: { select: { email: true } },
      },
    });

    if (!teamData) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const { plan, members } = teamData;
    const { seats } = plan;
    const currSeats = members.length;

    if (currSeats >= seats) {
      return NextResponse.json({ error: "Team seats are full" }, { status: 400 });
    }

    // check if email is already a member of the team
    const isCurrMember = members.find(
      (m: { user: { email: string } }) => m.user.email === email.toLowerCase().trim(),
    );
    if (isCurrMember) {
      return NextResponse.json({ error: "User is already a member of the team" }, { status: 400 });
    }

    // check if email is already invited to the team
    const isCurrInvite = teamData.invites.find((i) => i.email === email.toLowerCase().trim());
    if (isCurrInvite) {
      return NextResponse.json({ error: "User is already invited to the team" }, { status: 400 });
    }

    // create invite and create email
    // we will use invite id as the token
    const invite = await prisma.invite.create({
      data: {
        teamId: team.id,
        email: email.toLowerCase().trim(),
        role,
      },
    });

    // send invite email
    await sendEmail({
      from: "Qryptic <notifications@mailer.qryptic.io>",
      to: email,
      replyTo: "support@qryptic.io",
      subject: `You've been invited to join team ${teamData.name} on Qryptic!`,
      react: InviteEmail(invite.id, teamData.name),
      text: `You've been invited to join team ${teamData.name} on Qryptic! You can view the invite by clicking this link: ${protocol}${appDomain}${invite.id}`,
    });

    return NextResponse.json({ message: "Invite sent" });
  } catch (e) {
    console.error("Failed to create invite: ", e);
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
});
