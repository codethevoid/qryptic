import prisma from "@/db/prisma";
import { TeamWithMembers } from "@/types/teams";

type VerifyOwnershipResponse = {
  isAuthorized: boolean;
  team?: TeamWithMembers;
};

export const verifyOwnership = async (
  slug: string,
  userId: string,
): Promise<VerifyOwnershipResponse> => {
  const team = await prisma.team.findUnique({ where: { slug }, include: { members: true } });
  if (!team) return { isAuthorized: false };

  const user = team.members.find((member) => member.userId === userId);
  if (!user || !["owner", "super_admin"].includes(user.role)) return { isAuthorized: false };

  return { isAuthorized: true, team };
};
