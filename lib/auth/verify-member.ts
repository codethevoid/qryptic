import "server-only";

import prisma from "@/db/prisma";
import { Team, TeamMember, Plan, Domain } from "@prisma/client";

type CustomTeam = Team & { members: TeamMember[]; plan: Plan; domains: Domain[] };

type VerifyMemberResponse = {
  isAuthorized: boolean;
  team?: CustomTeam;
};

export const verifyMember = async (slug: string, userId: string): Promise<VerifyMemberResponse> => {
  const team: CustomTeam | null = await prisma.team.findUnique({
    where: { slug },
    include: { members: true, plan: true, domains: true },
  });

  if (!team) return { isAuthorized: false };
  const user = team.members.find((member) => member.userId === userId);
  if (!user) return { isAuthorized: false };

  return { team, isAuthorized: true };
};
