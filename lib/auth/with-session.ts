import "server-only";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { redis } from "@/lib/upstash/redis";
import { ratelimit } from "../upstash/rate-limit";
import { ipAddress } from "@vercel/functions";

type UserWithDefaultTeam = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  defaultTeam: string | null;
  isEmailVerified: boolean;
  hasUsedTrial: boolean;
};

type WithSessionHandler = {
  ({
    req,
    params,
    user,
  }: {
    req: NextRequest;
    params: Record<string, string>;
    user: UserWithDefaultTeam;
  }): Promise<NextResponse>;
};

export const withSession = (handler: WithSessionHandler) => {
  return async (req: NextRequest, { params = {} }: { params: Record<string, string> }) => {
    const token = await auth();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = ipAddress(req);
    const identifier = `session:${ip}`;
    const { success } = await ratelimit().limit(identifier);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

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

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userWithDefaultTeam: UserWithDefaultTeam = {
      ...user,
      defaultTeam: await redis.get(`user:${user.id}:defaultTeam`),
    };

    return await handler({ req, params, user: userWithDefaultTeam });
  };
};
