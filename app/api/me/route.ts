import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

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
      defaultTeam: true,
    },
  });
  if (!user) throw new Error("User not found");
  return NextResponse.json(user);
};
