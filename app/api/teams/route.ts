import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export const GET = async (req: NextRequest) => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");
  const teams = await prisma.teamMember.findMany({
    where: { userId: token.userId },
    include: { team: true },
  });
  return NextResponse.json(teams);
};
