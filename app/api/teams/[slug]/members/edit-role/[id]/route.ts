import { NextResponse } from "next/server";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import prisma from "@/db/prisma";

export const PATCH = withTeamOwner(async ({ team, params, req }) => {
  try {
    const { id: memberId } = params;
    const body = await req.json();
    const { role } = body;

    if (!role || (role !== "owner" && role !== "member")) {
      return NextResponse.json({ error: "Valid role is required" }, { status: 400 });
    }

    // make sure member belongs to team
    const member = await prisma.teamMember.findFirst({
      where: { id: memberId, teamId: team.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // update role
    await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    });

    return NextResponse.json({ message: "Role has been updated" });
  } catch (e) {
    console.error("Failed to edit role: ", e);
    return NextResponse.json({ error: "Failed to edit role" }, { status: 500 });
  }
});
