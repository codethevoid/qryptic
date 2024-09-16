"use server";

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { TagWithCounts } from "@/types/tags";
import { verifyMember } from "@/lib/auth/verify-member";

export const deleteTag = async (tag: TagWithCounts, slug: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // verify user has access to team
  const { isAuthorized, team } = await verifyMember(slug, token.userId);
  if (!team) return { error: true, message: "Team not found" };
  if (!isAuthorized) return { error: true, message: "Unauthorized" };

  // confirm tag exists
  const tagExists = await prisma.tag.findFirst({
    where: { id: tag.id, teamId: team.id as string },
  });
  if (!tagExists) return { error: true, message: "Tag not found" };

  // delete tag
  await prisma.tag.delete({ where: { id: tag.id } });

  return { message: "Tag deleted successfully" };
};
