import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/upstash/rate-limit";
import { ipAddress } from "@vercel/functions";
import { getThreats } from "@/lib/links/detect-threat";

export const GET = async (req: NextRequest) => {
  try {
    const success = await checkRatelimit(req);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const threats = await getThreats(url);
    if (threats.error) {
      return NextResponse.json({ error: "Error detecting threats" }, { status: 500 });
    }

    return NextResponse.json(threats);
  } catch (e) {
    console.error("Error in radar API: ", e);
    return NextResponse.json({ error: "Error scanning URL" }, { status: 500 });
  }
};

async function checkRatelimit(req: NextRequest) {
  const ip = ipAddress(req);
  const identifier = `${ip}-radar`;
  const { success } = await ratelimit().limit(identifier);
  return success;
}
