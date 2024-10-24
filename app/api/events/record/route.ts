import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { type UserAgent, Continent, Geo } from "@/types/events";
import { euCountries } from "@/utils/countries/eu-countries";

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

    const link = await prisma.link.findUnique({
      where: { id: linkId },
      select: { teamId: true, domainId: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const isEU = euCountries.includes(geo?.country);

    // check for local dev
    if (process.env.NODE_ENV === "development") {
      geo = localhostGeoData;
      ip = "127.0.0.1";
      continent = "NA";
    }

    const eventData = {
      linkId,
      teamId: link.teamId,
      domainId: link.domainId,
      destination: finalUrl,
      type: eventType || "click",
      ip: !isEU && ip ? ip : "unknown",
      continent: continent || "unknown",
      country: geo?.country || "unknown",
      region: geo?.region || "unknown",
      countryRegion: geo?.countryRegion || "unknown",
      city: geo?.city || "unknown",
      latitude: geo?.latitude || "unknown",
      longitude: geo?.longitude || "unknown",
      userAgent: ua.ua || "unknown",
      browser: ua.browser.name || "unknown",
      browserVersion: ua.browser.version || "unknown",
      deviceType: ua.device.type || "desktop",
      deviceModel: ua.device.model || "unknown",
      deviceVendor: ua.device.vendor || "unknown",
      browserEngine: ua.engine.name || "unknown",
      browserEngineVersion: ua.engine.version || "unknown",
      os: ua.os.name || "unknown",
      osVersion: ua.os.version || "unknown",
      cpu: ua.cpu.architecture || "unknown",
      referrer: referrer || "direct",
    };

    await prisma.event.create({ data: eventData });
    console.log("event recorded");

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
