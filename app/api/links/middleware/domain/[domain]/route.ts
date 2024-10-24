import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

const isAuthorized = (req: NextRequest) => {
  const bearer = req.headers.get("authorization");
  const token = bearer?.split(" ")[1];
  return token === process.env.QRYPTIC_API_KEY;
};

export const GET = async (req: NextRequest, { params }: { params: { domain: string } }) => {
  try {
    if (!isAuthorized(req)) {
      console.error("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { domain } = params;
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const domainData = await prisma.domain.findUnique({
      where: { name: domain.replace("www.", "").toLowerCase() },
      select: { destination: true },
    });

    if (!domainData) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json({ domainData });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
