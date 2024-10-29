import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const DELETE = withTeam(async ({ team: teamInfo, user, req }) => {
  try {
    // allow user to leave the team if they are not an owner
    if (user.role !== "owner") {
      await prisma.teamMember.delete({
        where: { id: user.id },
      });

      // get team for user to switch since they are leaving the team
    }

    return NextResponse.json({ message: "Successfully left the team" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
});
