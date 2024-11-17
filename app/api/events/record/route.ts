import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { type UserAgent, Continent, Geo } from "@/types/events";
import { euCountries } from "@/utils/countries/eu-countries";

const getDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return "direct";
  }
};

const localhostGeoData = {
  city: "Dayton",
  country: "US",
  flag: "🇺🇸",
  countryRegion: "OH",
  region: "OH",
  latitude: "39.7589",
  longitude: "-84.1916",
};

type Body = {
  linkId: string;
  ua: UserAgent;
  eventType: "click" | "scan";
  ip: string | undefined;
  geo: Geo;
  referrer: string | null;
  continent: Continent;
  finalUrl: string;
};

const isAuthorized = (req: NextRequest) => {
  const bearer = req.headers.get("authorization");
  const token = bearer?.split(" ")[1];
  return token === process.env.QRYPTIC_API_KEY;
};

export const POST = async (req: NextRequest) => {
  try {
    if (!isAuthorized(req)) {
      console.error("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = (await req.json()) as Body;
    let { linkId, ua, eventType, ip, geo, referrer, continent, finalUrl } = body;

    if (!linkId || !finalUrl) {
      return NextResponse.json({ error: "Link ID and final URL are required" }, { status: 400 });
    }

    // check for local dev
    if (process.env.NODE_ENV === "development") {
      geo = localhostGeoData;
      ip = "127.0.0.1";
      continent = "NA";
    }

    const link = await prisma.link.findUnique({
      where: { id: linkId },
      select: { teamId: true, domain: { select: { id: true, name: true } }, slug: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // get search params from finalUrl
    const searchParams = new URLSearchParams(finalUrl.split("?")[1]);
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");
    const utmContent = searchParams.get("utm_content");

    const isEU = euCountries.includes(geo?.country);
    ip = !isEU && typeof ip === "string" && ip.trim().length > 0 ? ip : "Unknown";

    const eventData = {
      linkId,
      teamId: link.teamId,
      domainId: link.domain.id,
      shortUrl: `${link.domain.name}/${link.slug}`,
      slug: link.slug,
      domainName: link.domain.name,
      destination: finalUrl,
      type: eventType || "click",
      ip,
      continent: continent || "Unknown",
      country: geo?.country || "Unknown",
      region: geo?.region || "Unknown",
      countryRegion: geo?.countryRegion || "Unknown",
      city: geo?.city || "Unknown",
      latitude: geo?.latitude || "Unknown",
      longitude: geo?.longitude || "Unknown",
      userAgent: ua.ua || "Unknown",
      browser: ua.browser.name || "Unknown",
      browserVersion: ua.browser.version || "Unknown",
      deviceType: ua.device.type || "Unknown",
      deviceModel: ua.device.model || "Unknown",
      deviceVendor: ua.device.vendor || "Unknown",
      browserEngine: ua.engine.name || "Unknown",
      browserEngineVersion: ua.engine.version || "Unknown",
      os: ua.os.name || "Unknown",
      osVersion: ua.os.version || "Unknown",
      cpu: ua.cpu.architecture || "Unknown",
      referrer: referrer || "Direct",
      referrerDomain: referrer ? getDomain(referrer) : "Direct",
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
    };

    await prisma.event.create({ data: eventData });
    console.log("event recorded");

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
