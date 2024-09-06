"use server";

import prisma from "@/db/prisma";
import { auth } from "@/auth";

type UpdateDefaultTeamResponse = {
  error?: boolean;
  message: string;
  slug?: string | null;
};

export const updateDefaultTeam = async (
  slug: string | null,
): Promise<UpdateDefaultTeamResponse> => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };
  console.log("updateDefaultTeam -> slug", slug);

  // if no slug is provided, set default team to null
  if (!slug) {
    await prisma.user.update({
      where: { id: token.userId },
      data: { defaultTeam: null },
    });
    return { message: "Team updated", slug: null };
  }

  // make sure team exists and user is a member
  const team = await prisma.team.findUnique({
    where: { slug },
    include: { members: { where: { userId: token.userId } } },
  });

  if (!team) return { error: true, message: "Team not found" };
  if (!team.members.length) return { error: true, message: "Unauthorized" };

  // update user's default team
  await prisma.user.update({
    where: { id: token.userId },
    data: { defaultTeam: slug },
  });

  return { message: "Team updated", slug };
};
