"use server";

import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { colors } from "@/utils/colors";

export const createTag = async (name: string, color: string, slug: string) => {
  const token = await auth();
  if (!token) return { error: true, message: "Unauthorized" };

  const team = await prisma.team.findUnique({
    where: { slug },
    select: { members: true, id: true },
  });
  if (!team) return { error: true, message: "Team not found" };
  const user = team.members.find((member) => member.userId === token.userId);
  if (!user) return { error: true, message: "Unauthorized" };

  if (!colors.includes(color)) return { error: true, message: "Invalid color" };

  const tagExists = await prisma.tag.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" }, teamId: team.id as string },
  });

  if (tagExists) return { error: true, message: "Tag name already exists" };

  // create tag
  await prisma.tag.create({
    data: {
      name: name.trim(),
      color,
      team: { connect: { slug } },
    },
  });

  return { message: "Tag created successfully" };
};
