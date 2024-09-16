"use server";

import { TagColor } from "@/types/colors";
import { TagWithCounts } from "@/types/tags";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { colors } from "@/utils/colors";
import { verifyMember } from "@/lib/auth/verify-member";

type EditTagParams = {
  tag: TagWithCounts;
  color: TagColor;
  slug: string;
  name: string;
};

type EditTagResponse = {
  error?: boolean;
  message?: string;
};

export const editTag = async ({
  tag,
  name,
  color,
  slug,
}: EditTagParams): Promise<EditTagResponse> => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  // make sure user is part of team
  const { team, isAuthorized } = await verifyMember(slug, token.userId);
  if (!isAuthorized) return { error: true, message: "Unauthorized" };
  if (!team) return { error: true, message: "Team not found" };

  // check if tag exists
  const tagExists = await prisma.tag.findFirst({
    where: { id: tag.id, teamId: team.id as string },
  });

  if (!tagExists) return { error: true, message: "Tag not found" };

  // check if color is valid
  if (!colors.includes(color)) return { error: true, message: "Invalid color" };

  // check if the new name is already taken by another tag in the team
  if (name.toLowerCase().trim() !== tag.name.toLowerCase().trim()) {
    const doesNewNameExist = await prisma.tag.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" }, teamId: team.id as string },
    });
    if (doesNewNameExist) return { error: true, message: "Tag name already exists" };
  }

  // update tag
  await prisma.tag.update({
    where: { id: tag.id },
    data: { name: name.trim(), color },
  });

  return { message: "Tag updated" };
};
