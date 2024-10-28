import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { Domain } from "@prisma/client";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async ({ team, req }) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "5", 10);
  const status = url.searchParams.get("status") || "active";
  const search = url.searchParams.get("search") || "";
  const includeDefault = url.searchParams.get("includeDefault") === "true";
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let domains = [];
  let count = 0;

  if (status === "active" || status === "archived") {
    domains = await prisma.domain.findMany({
      where: {
        teamId: team.id,
        isArchived: status === "archived",
        name: { contains: search, mode: "insensitive" },
      },
      include: { _count: { select: { links: true } } },
      skip,
      take,
    });

    count = await prisma.domain.count({
      where: {
        teamId: team.id,
        isArchived: status === "archived",
        name: { contains: search, mode: "insensitive" },
      },
    });
  } else {
    domains = await prisma.domain.findMany({
      where: {
        teamId: team.id,
        name: { contains: search, mode: "insensitive" },
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        isPrimary: true,
        isDefault: true,
        isVerified: true,
        destination: true,
        isSubdomain: true,
        isArchived: true,
        _count: { select: { links: true } },
      },
      skip,
      take,
    });

    count = await prisma.domain.count({
      where: {
        teamId: team.id,
        name: { contains: search, mode: "insensitive" },
      },
    });
  }

  if (includeDefault) {
    const defaultDomains = await prisma.domain.findMany({
      where: {
        enabledTeams: { some: { id: team.id } },
        isDefault: true,
        isArchived: false,
      },
    });
    domains = [...defaultDomains, ...domains];
  }

  return NextResponse.json({ domains, count });
});
