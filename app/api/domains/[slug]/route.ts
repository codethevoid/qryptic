import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { Domain } from "@prisma/client";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async ({ team }) => {
  const domains: Domain[] = await prisma.domain.findMany({
    where: { teamId: team.id },
    include: { _count: { select: { links: true } } },
  });

  return NextResponse.json({ domains });
});
