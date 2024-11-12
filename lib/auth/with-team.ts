import "server-only";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { Team, TeamMember } from "@prisma/client";
import { auth } from "@/auth";
import { ratelimit } from "../upstash/rate-limit";
import { ipAddress } from "@vercel/functions";

type CustomTeam = Pick<Team, "id" | "slug"> & { members?: TeamMember[] };

type WithTeamHandler = {
  ({
    req,
    params,
    team,
    user,
  }: {
    req: NextRequest;
    params: Record<string, string>;
    team: { id: string; slug: string };
    user: TeamMember;
  }): Promise<NextResponse>;
};

export const withTeam = (handler: WithTeamHandler) => {
  return async (req: NextRequest, { params = {} }: { params: Record<string, string> }) => {
    const token = await auth();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const slug = params.slug || req.nextUrl.searchParams.get("slug") || undefined;
    if (!slug) return NextResponse.json({ error: "No team provided" }, { status: 400 });

    const ip = ipAddress(req);
    const identifier = `team:${ip}`;
    const { success } = await ratelimit(20, "10 s").limit(identifier);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    let team: CustomTeam | null = await prisma.team.findUnique({
      where: { slug },
      select: { id: true, slug: true, members: { where: { userId: token.userId as string } } },
    });

    if (!team) return NextResponse.json({ error: "No team found" }, { status: 404 });
    if (!team.members?.length) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const user = team.members[0];
    team = { id: team.id, slug: team.slug };

    return await handler({ req, params, team, user });
  };
};
