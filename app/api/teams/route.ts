import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export const GET = async () => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");
  let teams = await prisma.team.findMany({
    where: { members: { some: { userId: token.userId } } },
    include: {
      members: true,
      plan: true,
      domains: true,
      _count: { select: { events: true, links: true } },
    },
  });

  teams = teams.filter((team) => {
    const teamMember = team.members?.find((member) => member.userId === token.userId);
    // if user is super admin, they can view the team no matter what
    if (teamMember?.role === "super_admin") return team;

    const allowedSeats = team.plan.seats;
    const currSeats = team.members?.length as number;
    // if team is not on a free plan, owner can still view the team
    // even if they have exceeded the seats, (this is so they can manage the team)
    if (!team.plan.isFree && teamMember?.role === "owner") return team;
    // else if current seats is less than or equal to allowed seats, user can view the team
    if (currSeats <= allowedSeats) return team;
  });

  return NextResponse.json(teams);
};
