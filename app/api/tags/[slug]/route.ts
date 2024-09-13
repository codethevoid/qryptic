import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const team = await prisma.team.findUnique({
    where: { slug },
    select: { members: true, tags: true },
  });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  // check if user is a member of the team
  const isMember = team.members.some((member) => member.userId === token.userId);
  if (!isMember) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ tags: team.tags });
};
