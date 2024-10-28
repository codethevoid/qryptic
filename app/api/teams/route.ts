import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { adminRoles } from "@/utils/roles";

type Member = {
  userId: string;
  role: string;
};

type Team = {
  id: string;
  name: string;
  slug: string;
  image: string;
  members: Member[] | number;
  plan: { name: string; seats: number; isFree: boolean };
  domains: { id: string; name: string; isPrimary: boolean }[];
  _count: { events: number; links: number };
};

export const GET = async () => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");

  let teams: Team[] | null = await prisma.team.findMany({
    where: { members: { some: { userId: token.userId } } },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      members: { select: { userId: true, role: true } },
      plan: { select: { name: true, seats: true, isFree: true } },
      domains: { select: { id: true, name: true, isPrimary: true } },
      _count: { select: { events: true, links: true } },
    },
  });

  teams = teams.filter((team) => {
    const teamMember = (team.members as Member[])?.find((member) => member.userId === token.userId);
    const allowedSeats = team.plan.seats;
    const currSeats = (team.members as Member[])?.length as number;
    const role = teamMember?.role as string;

    // if (team.plan.isFree) {
    //   if (role !== "super_admin") return false;
    // } else if (currSeats > allowedSeats && !adminRoles.includes(role)) {
    //   return false;
    // }

    // we will prompt the owner(s) to upgrade the plan if the current seats exceed the allowed seats
    if (role !== "owner" && currSeats > allowedSeats) return false;

    return true;
  });

  teams.forEach((team) => (team.members = (team.members as Member[]).length));

  return NextResponse.json(teams);
};
