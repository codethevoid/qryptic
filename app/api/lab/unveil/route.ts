import { NextResponse, NextRequest } from "next/server";
import { constructURL } from "@/utils/construct-url";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const GET = async (req: NextRequest) => {
  try {
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

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    // await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(finalDestination, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({ encoding: "base64", type: "png" });
    await browser.close();

    return NextResponse.json({
      shortUrl: constructedURL,
      destination: finalDestination,
      preview: `data:image/png;base64,${screenshot}`,
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
