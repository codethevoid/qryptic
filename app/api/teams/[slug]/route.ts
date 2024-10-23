import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { Team, TeamMember, Plan, Domain } from "@prisma/client";
import { adminRoles } from "@/utils/roles";

type CustomTeam = Team & {
  members?: TeamMember[];
  plan: Plan;
  domains: Domain[];
};

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");
  const { slug } = params;

  const team: CustomTeam | null = await prisma.team.findUnique({
    where: { slug },
    include: { members: true, plan: true, domains: true },
  });

  if (!team) return NextResponse.json({ message: "Team not found" }, { status: 404 });

  const teamMember = team.members?.find((member) => member.userId === token.userId);
  if (!teamMember) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // check if plan is has been downgraded and force super_admin or owner to either delete
  // team member or upgrade plan and we we wont let members view the team
  const allowedSeats = team.plan.seats;
  const currentSeats = team.members?.length as number;
  const isFreePlan = team.plan.isFree;

  // if plan is free and current seats is greater than allowed seats, we will not allow
  // any member to view the team other than super admin bc there can only be 1 seat on free plan
  if (isFreePlan) {
    if (teamMember.role !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } else if (currentSeats > allowedSeats && !adminRoles.includes(teamMember.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // delete other members list from team
  delete team.members;

  return NextResponse.json({
    id: team.id,
    plan: team.plan,
    slug: team.slug,
    name: team.name,
    image: team.image,
    company: team.company,
    subscriptionStatus: team.subscriptionStatus,
    trialEndsAt: team.trialEndsAt,
    hasPaymentMethod: !!team.paymentMethodId,
    exceededSeats: currentSeats > allowedSeats,
    exceededDomains: team.domains.length > team.plan.domains,
    user: { role: teamMember.role },
  });
};
