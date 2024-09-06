import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { Team, TeamMember, Plan } from "@prisma/client";

type CustomTeam = Team & {
  members?: TeamMember[];
  plan: Plan;
};

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");
  const { slug } = params;

  const team: CustomTeam | null = await prisma.team.findUnique({
    where: { slug },
    include: { members: true, plan: true },
  });

  if (!team) return NextResponse.json({ message: "Team not found" }, { status: 404 });

  const teamMember = team.members?.find((member) => member.userId === token.userId);
  if (!teamMember) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // delete other members list from team
  delete team.members;

  return NextResponse.json({
    plan: team.plan,
    slug: team.slug,
    name: team.name,
    image: team.image,
    company: team.company,
    subscriptionStatus: team.subscriptionStatus,
    user: {
      role: teamMember.role,
    },
  });
};
