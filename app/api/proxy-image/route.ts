import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Fetch the image from the external source
    const response = await fetch(url, {
      headers: {
        "Content-Type": "image/png",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    // Create a new response stream
    const headers = new Headers(response.headers);
    headers.set("Content-Type", "image/png");

    // Stream the image data back to the client with the appropriate headers
    return new NextResponse(response.body, {
      headers,
      status: response.status,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
};
