import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import og from "open-graph-scraper";
import { constructURL } from "@/utils/construct-url";

const isValidURL = (url: string) => {
  const constructedUrl = constructURL(url);
  try {
    new URL(constructedUrl);
    return true;
  } catch {
    return false;
  }
};

export const GET = withTeam(async ({ req }) => {
  try {
    const url = req.nextUrl;
    const urlToFetch = url.searchParams.get("url");
    if (!urlToFetch) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Validate the URL to check if it's properly formatted
    if (!isValidURL(urlToFetch)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (urlToFetch.startsWith("mailto:") || urlToFetch.startsWith("tel:")) {
      const ogData = {
        title: "",
        description: "",
        image: "",
        url: urlToFetch,
      };
      return NextResponse.json({ ...ogData });
    }

    const options = {
      url: urlToFetch,
      onlyGetOpenGraphInfo: true,
    };

    try {
      const data = await og(options);

      if (data.error) {
        return NextResponse.json({ error: "Failed to fetch Open Graph data" }, { status: 500 });
      }

      const { result } = data;
      const { ogTitle, ogDescription, ogImage, ogUrl } = result;
      const image = ogImage?.length ? ogImage[0].url : null;

      const ogData = {
        title: ogTitle || "",
        description: ogDescription || "",
        image: image || "",
        url: ogUrl || "",
      };

      return NextResponse.json({ ...ogData });
    } catch (e) {
      return NextResponse.json({ error: "Failed to fetch Open Graph data" }, { status: 500 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
});
