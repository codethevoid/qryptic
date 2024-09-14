import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const search = url.searchParams.get("search") || "";
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const team = await prisma.team.findUnique({
    where: { slug },
    select: {
      members: true,
      tags: {
        where: { name: { contains: search, mode: "insensitive" } },
        skip,
        take,
        include: { links: { select: { _count: { select: { events: true } } } } },
      },
      _count: { select: { tags: { where: { name: { contains: search, mode: "insensitive" } } } } },
    },
  });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  // check if user is a member of the team
  const isMember = team.members.some((member) => member.userId === token.userId);
  if (!isMember) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tagsWithEventCount = team.tags.map((tag) => {
    const eventCount = tag.links.reduce((acc, link) => acc + link._count.events, 0);
    return {
      id: tag.id,
      name: tag.name,
      color: tag.color,
      eventCount,
      linkCount: tag.links?.length || 0,
    };
  });

  return NextResponse.json({ tags: tagsWithEventCount, totalTags: team._count.tags });
};
