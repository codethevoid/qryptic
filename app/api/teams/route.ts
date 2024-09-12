import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { adminRoles } from "@/lib/constants/roles";

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
    const allowedSeats = team.plan.seats;
    const currSeats = team.members?.length as number;
    const role = teamMember?.role as string;

    if (team.plan.isFree) {
      if (role !== "super_admin") return false;
    } else if (currSeats > allowedSeats && !adminRoles.includes(role)) {
      return false;
    }

    return true;
  });

  return NextResponse.json(teams);
};
