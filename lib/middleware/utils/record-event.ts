import "server-only";
import { userAgent } from "next/server";
import { detectEventType } from "@/lib/middleware/utils/detect-event-type";
import { detectBot } from "@/lib/middleware/utils/detect-bot";
import { NextRequest } from "next/server";
import { geolocation, ipAddress } from "@vercel/functions";
import { protocol, rootDomain } from "@/utils/qryptic/domains";
import { redis } from "@/lib/upstash/redis";

type Props = {
  req: NextRequest;
  linkId: string;
  finalUrl: string;
};

export const recordEvent = async ({ req, linkId, finalUrl }: Props): Promise<void> => {
  const ua = userAgent(req);
  const eventType = detectEventType(req);
  const isBotRequest = detectBot(req);
  const ip = ipAddress(req);
  const geo = geolocation(req);
  const referrer = req.headers.get("referer");
  const continent = req.headers.get("x-vercel-ip-continent");

  // we will not track bot requests or requests without a user agent
  if (isBotRequest) return;

  const key = `event:${linkId}:${ip}`;
  const exists = await redis.exists(key);
  if (exists) return;

  // set key in upstash to prevent duplicate events for next 5 minutes
  await redis.set(key, "1", { ex: 300 });

  // record event
  try {
    const res = await fetch(`${protocol}${rootDomain}/api/events/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QRYPTIC_API_KEY}`,
      },
      body: JSON.stringify({ linkId, ua, eventType, ip, geo, referrer, continent, finalUrl }),
    });
  } catch (e) {
    console.error(e);
  }
};
