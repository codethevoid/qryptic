import { NextResponse, NextRequest } from "next/server";
import { constructURL } from "@/utils/construct-url";
import { ratelimit } from "@/lib/upstash/rate-limit";
import { ipAddress } from "@vercel/functions";
export const GET = async (req: NextRequest) => {
  try {
    const success = await checkRatelimit(req);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // make sure the short url is valid
    const constructedURL = constructURL(url);
    try {
      new URL(constructedURL);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const finalDestination = await resolveFinalDestination(constructedURL);
    if (!finalDestination) {
      return NextResponse.json({ error: "Failed to get final URL" }, { status: 400 });
    }

    const searchParams = new URLSearchParams();
    searchParams.set("access_key", process.env.SCREENSHOT_API_KEY!);
    searchParams.set("url", finalDestination);
    searchParams.set("format", "png");
    searchParams.set("block_ads", "true");
    searchParams.set("block_cookie_banners", "true");

    const res = await fetch(`https://api.screenshotone.com/take?${searchParams.toString()}`);
    let base64 = null;
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      base64 = Buffer.from(buffer).toString("base64");
    }

    return NextResponse.json({
      shortUrl: constructedURL,
      destination: finalDestination,
      preview: base64 ? `data:image/png;base64,${base64}` : null,
    });
  } catch (e) {
    console.error("Error getting link preview for shortened link: ", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

async function resolveFinalDestination(url: string, maxRedirects = 10): Promise<string | null> {
  let currentUrl = url;
  let redirectCount = 0;

  while (redirectCount < maxRedirects) {
    try {
      const res = await fetch(currentUrl, { method: "HEAD", redirect: "manual" });
      const location = res.headers.get("location");

      // If no `location` header, we've reached the final destination
      if (!location) return currentUrl;

      // Handle relative redirects by resolving against the current URL
      currentUrl = new URL(location, currentUrl).toString();
      redirectCount++;
    } catch (e) {
      console.error("Error resolving final destination: ", e);
      return null;
    }
  }

  // Too many redirects
  console.error("Too many redirects while resolving the URL.");
  return null;
}

async function checkRatelimit(req: NextRequest) {
  const ip = ipAddress(req);
  const identifier = `${ip}-unveil`;
  const { success } = await ratelimit().limit(identifier);
  return success;
}
