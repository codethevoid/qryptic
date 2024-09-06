import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export const GET = async (req: NextRequest) => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");
  const teams = await prisma.team.findMany({
    where: { members: { some: { userId: token.userId } } },
    include: {
      plan: true,
      domains: true,
      _count: { select: { events: true, links: true } },
    },
  });
  return NextResponse.json(teams);
};
