import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async ({ req, team }) => {
  try {
    // get full url
    const url = req.nextUrl;

    // extract search params
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const sort = url.searchParams.get("sort") || "date";
    let domains: string | string[] = url.searchParams.get("domains") || "";
    let tags: string | string[] = url.searchParams.get("tags") || "";
    let status: string | string[] = url.searchParams.get("status") || "";

    // parse domains, tags, and status
    domains = domains ? domains.split(",") : [];
    tags = tags ? tags.split(",") : [];
    status = status ? status.split(",") : [];

    const take = pageSize;
    const skip = (page - 1) * pageSize;

    // get links, domains, and tags
    const [links, allDomains, allTags, activeCount, archivedCount, filteredCount] =
      await prisma.$transaction([
        prisma.link.findMany({
          where: {
            teamId: team.id,
            ...(domains.length > 0 && { domainId: { in: domains } }),
            ...(tags.length > 0 && { tags: { some: { id: { in: tags } } } }),
            ...(status.length === 1 && { isArchived: status.includes("archived") }),
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { destination: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { domain: { name: { contains: search, mode: "insensitive" } } },
            ],
          },
          select: {
            id: true,
            name: true,
            slug: true,
            destination: true,
            createdAt: true,
            isArchived: true,
            user: { select: { name: true, image: true, email: true } },
            domain: { select: { name: true } },
            events: { select: { type: true } },
            tags: { select: { id: true, name: true, color: true } },
            _count: { select: { events: true, tags: true } },
            qrCode: { select: { color: true, logo: true, logoHeight: true, logoWidth: true } },
          },
          orderBy: {
            ...(sort === "date" && { createdAt: "desc" }),
            ...(sort === "activity" && { events: { _count: "desc" } }),
          },
          skip,
          take,
        }),
        prisma.domain.findMany({
          where: {
            OR: [
              { teamId: team.id }, // teams domains
              { enabledTeams: { some: { id: team.id } } }, // enabled default domains
              { links: { some: { teamId: team.id } } }, // links with certain domains that could have been disabled
            ],
          },
          select: { id: true, name: true },
        }),
        prisma.tag.findMany({
          where: { teamId: team.id },
          select: { id: true, name: true, color: true },
        }),
        prisma.link.count({
          where: { teamId: team.id, isArchived: false },
        }),
        prisma.link.count({
          where: { teamId: team.id, isArchived: true },
        }),
        prisma.link.count({
          where: {
            teamId: team.id,
            ...(domains.length > 0 && { domainId: { in: domains } }),
            ...(tags.length > 0 && { tags: { some: { id: { in: tags } } } }),
            ...(status.length === 1 && { isArchived: status.includes("archived") }),
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { destination: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { domain: { name: { contains: search, mode: "insensitive" } } },
            ],
          },
        }),
      ]);

    return NextResponse.json({
      links,
      domains: allDomains,
      tags: allTags,
      totals: {
        active: activeCount,
        archived: archivedCount,
        all: activeCount + archivedCount,
        filtered: filteredCount,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
