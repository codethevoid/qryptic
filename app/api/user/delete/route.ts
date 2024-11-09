import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";

export const DELETE = withSession(async ({ user }) => {
  try {
    const { id } = user;

    // check if user is part of a team
    // if they are, they need to leave the team first
    const teams = await prisma.teamMember.findMany({
      where: { userId: id },
    });

    if (teams.length) {
      return NextResponse.json(
        { error: "Leave or delete all teams before deleting account" },
        { status: 400 },
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" });
  } catch (e) {
    console.error("Error deleting user: ", e);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
});
