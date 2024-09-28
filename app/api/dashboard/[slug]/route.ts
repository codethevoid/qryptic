import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { NextResponse } from "next/server";
import { differenceInDays, subDays, subMonths, addDays, startOfDay } from "date-fns";

export const GET = withTeam(async ({ req, team }) => {
  try {
    const url = req.nextUrl;
    const to = new Date(url.searchParams.get("to") || "");
    const from = new Date(url.searchParams.get("from") || "");
    const timeFrame = url.searchParams.get("timeFrame") || "fourWeeks";
    const days = differenceInDays(to, from);
    const prev = getPreviousPeriod(from, to, timeFrame);

    console.log(from, addDays(to, 1));
    console.log(prev.from, addDays(prev.to, 1));

    const [links, prevLinks, events, prevEvents] = await prisma.$transaction([
      prisma.link.count({
        where: {
          teamId: team.id,
          createdAt: { gte: from, lt: addDays(to, 1) },
        },
      }),
      prisma.link.count({
        where: {
          teamId: team.id,
          createdAt: { gte: prev.from, lt: addDays(prev.to, 1) },
        },
      }),
      prisma.event.findMany({
        where: {
          teamId: team.id,
          createdAt: { gte: from, lt: addDays(to, 1) },
        },
        select: { type: true, createdAt: true },
      }),
      prisma.event.findMany({
        where: {
          teamId: team.id,
          createdAt: { gte: prev.from, lt: addDays(prev.to, 1) },
        },
        select: { type: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      links: {
        count: links,
        prevCount: prevLinks,
        percentChange: calcPercentChange(links, prevLinks),
      },
      clicks: {
        count: events.filter((e) => e.type === "click").length,
        prevCount: prevEvents.filter((e) => e.type === "click").length,
        percentChange: calcPercentChange(
          events.filter((e) => e.type === "click").length,
          prevEvents.filter((e) => e.type === "click").length,
        ),
      },
      scans: {
        count: events.filter((e) => e.type === "scan").length,
        prevCount: prevEvents.filter((e) => e.type === "scan").length,
        percentChange: calcPercentChange(
          events.filter((e) => e.type === "scan").length,
          prevEvents.filter((e) => e.type === "scan").length,
        ),
      },
      events,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get dashboard data" }, { status: 500 });
  }
});

function calcPercentChange(current: number, previous: number) {
  if (current === previous) return 0;
  if (current === 0 && previous > 0) return -100;
  if (current > 0 && previous === 0) return "Infinity";
  return Math.round(((current - previous) / previous) * 100);
}

function getPreviousPeriod(from: Date, to: Date, timeFrame: string) {
  const diff = differenceInDays(to, from);
  if (diff === 0) {
    return {
      from: subDays(from, 1),
      to: subDays(to, 1),
    };
  }

  if (timeFrame === "monthToDate") {
    return {
      from: subMonths(from, 1),
      to: subMonths(to, 1),
    };
  }

  if (timeFrame === "yearToDate") {
    return {
      from: subMonths(from, 12),
      to: subMonths(to, 12),
    };
  }

  return {
    from: subDays(from, diff + 1),
    to: subDays(to, diff + 1),
  };
}
