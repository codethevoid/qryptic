import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";

const deepLinks = ["mailto:", "sms:", "tel:"];

const constructURL = (destination: string) => {
  if (deepLinks.some((link) => destination.startsWith(link))) {
    return { isDeepLink: true, destination };
  }

  if (destination.startsWith("http")) return { destination };
  return { destination: `https://${destination}` };
};

export const GET = withTeam(async ({ req }) => {
  try {
    const url = req.nextUrl;
    const urlToFetch = url.searchParams.get("url") || "";
    if (!urlToFetch) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const { isDeepLink, destination } = constructURL(urlToFetch);
    if (isDeepLink) return NextResponse.json({ isCloakable: false });

    // fetch headers to check if the URL is cloakable
    const response = await fetch(destination, { method: "HEAD" });
    if (!response.ok) return NextResponse.json({ isCloakable: false });

    const headers = response.headers;

    // check if the URL is cloakable
    const xFrameOptions = headers.get("x-frame-options") || "";
    const csp = headers.get("content-security-policy") || "";

    if (xFrameOptions.toUpperCase() === "DENY" || xFrameOptions.toUpperCase() === "SAMEORIGIN") {
      return NextResponse.json({ isCloakable: false });
    }

    if (csp.includes("frame-ancestors")) {
      return NextResponse.json({ isCloakable: false });
    }

    return NextResponse.json({ isCloakable: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
