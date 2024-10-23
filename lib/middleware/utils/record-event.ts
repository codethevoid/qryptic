import { userAgent } from "next/server";
import { isQr } from "@/lib/middleware/utils/is-qr";
import { isBot } from "@/lib/middleware/utils/is-bot";
import { NextRequest } from "next/server";
import { geolocation, ipAddress } from "@vercel/functions";
import { countries } from "@/utils/countries/countries";
import { euCountries } from "@/utils/countries/eu-countries";
import prisma from "@/db/prisma";
import { protocol, rootDomain } from "@/utils/qryptic/domains";

export const recordEvent = async (req: NextRequest, linkId: string) => {
  const ua = userAgent(req);
  const eventType = isQr(req) ? "scan" : "click";
  const isBotRequest = isBot(req);
  const ip = ipAddress(req);
  const location = geolocation(req);

  // we will not track bot requests
  if (isBotRequest) return null;

  // record event
  try {
    const res = await fetch(`${protocol}${rootDomain}/api/events/record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, ua, eventType, ip, location }),
    });
  } catch (e) {
    console.error(e);
  }
};
