import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { Domain, TeamMember } from "@prisma/client";

type Team = {
  domains: Domain[];
  members: TeamMember[];
};

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;

  // verify ownership of team
  const team: Team | null = await prisma.team.findUnique({
    where: { slug },
    select: { domains: true, members: true },
  });

  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
  const user = team.members.find((m) => m.userId === token.userId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ domains: team.domains });
};
