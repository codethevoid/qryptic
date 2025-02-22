import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { addDays, differenceInDays, subHours } from "date-fns";

export const GET = withTeam(async ({ req, team }) => {
  try {
    let from = new Date(req.nextUrl.searchParams.get("from") || "");
    let to = new Date(req.nextUrl.searchParams.get("to") || "");
    const shortUrl = req.nextUrl.searchParams.get("shortUrl") || "";
    const destination = req.nextUrl.searchParams.get("destination") || "";
    const referrer = req.nextUrl.searchParams.get("referrer") || "";
    const referrerDomain = req.nextUrl.searchParams.get("referrerDomain") || "";
    const country = req.nextUrl.searchParams.get("country") || "";
    const city = req.nextUrl.searchParams.get("city") || "";
    const browser = req.nextUrl.searchParams.get("browser") || "";
    const os = req.nextUrl.searchParams.get("os") || "";
    const deviceType = req.nextUrl.searchParams.get("deviceType") || "";
    const utmSource = req.nextUrl.searchParams.get("utmSource") || "";
    const utmMedium = req.nextUrl.searchParams.get("utmMedium") || "";
    const utmCampaign = req.nextUrl.searchParams.get("utmCampaign") || "";
    const utmTerm = req.nextUrl.searchParams.get("utmTerm") || "";
    const utmContent = req.nextUrl.searchParams.get("utmContent") || "";

    if (!from || !to) {
      return NextResponse.json({ error: "Missing date parameters" }, { status: 400 });
    }

    const events = await prisma.event.findMany({
      where: {
        teamId: team.id,
        createdAt: { gte: from, lt: addDays(to, 1) },
        ...(shortUrl && { shortUrl }),
        ...(destination && { destination }),
        ...(referrer && { referrer }),
        ...(referrerDomain && { referrerDomain }),
        ...(country && { country }),
        ...(city && { city }),
        ...(browser && { browser }),
        ...(os && { os }),
        ...(deviceType && { deviceType }),
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
        ...(utmTerm && { utmTerm }),
        ...(utmContent && { utmContent }),
      },
      select: {
        id: true,
        createdAt: true,
        slug: true,
        domainName: true,
        shortUrl: true,
        destination: true,
        type: true,
        continent: true,
        country: true,
        city: true,
        browser: true,
        deviceType: true,
        os: true,
        referrer: true,
        referrerDomain: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmTerm: true,
        utmContent: true,
      },
    });

    return NextResponse.json(events);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server errro" }, { status: 500 });
  }
});
