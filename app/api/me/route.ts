import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { redis } from "@/lib/upstash/redis";

type UserWithDefaultTeam = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isEmailVerified: boolean;
  hasUsedTrial: boolean;
  defaultTeam: string | null;
};

export const GET = async () => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: token.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isEmailVerified: true,
      hasUsedTrial: true,
    },
  });

  if (!user) throw new Error("User not found");

  const userWithDefaultTeam: UserWithDefaultTeam = {
    ...user,
    defaultTeam: await redis.get(`user:${user.id}:defaultTeam`),
  };

  return NextResponse.json(userWithDefaultTeam);
};
