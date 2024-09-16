import prisma from "@/db/prisma";
import { Team, TeamMember } from "@prisma/client";

type CustomTeam = Pick<Team, "id"> & { members: TeamMember[] };

type VerifyMemberResponse = {
  isAuthorized: boolean;
  team?: CustomTeam;
};

export const verifyMember = async (slug: string, userId: string): Promise<VerifyMemberResponse> => {
  const team: CustomTeam | null = await prisma.team.findUnique({
    where: { slug },
    select: { members: true, id: true },
  });

  if (!team) return { isAuthorized: false };
  const user = team.members.find((member) => member.userId === userId);
  if (!user) return { isAuthorized: false };

  return { team, isAuthorized: true };
};
