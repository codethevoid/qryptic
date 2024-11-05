import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { redis } from "@/lib/upstash/redis";
import { TeamMember } from "@prisma/client";

type userSettingsWithDefaultTeam = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isEmailVerified: boolean;
  googleAuth: boolean;
  credentialsAuth: boolean;
  teams: {
    role: TeamMember["role"];
    team: {
      id: string;
      name: string;
      slug: string;
      image: string;
    };
  }[];
  defaultTeam: string | null;
};

export const GET = withSession(async ({ user }) => {
  try {
    const userSettings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isEmailVerified: true,
        googleAuth: true,
        credentialsAuth: true,
        teams: {
          select: {
            role: true,
            team: { select: { id: true, name: true, slug: true, image: true } },
          },
        },
      },
    });

    if (!userSettings) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const finalUserSettings: userSettingsWithDefaultTeam = {
      ...userSettings,
      defaultTeam: await redis.get(`user:${user.id}:defaultTeam`),
    };

    return NextResponse.json(finalUserSettings);
  } catch (e) {
    console.error("Error getting user settings: ", e);
    return NextResponse.json({ error: "Error getting user settings" }, { status: 500 });
  }
});
