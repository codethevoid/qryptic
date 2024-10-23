import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const GET = async (req: NextRequest, { params }: { params: { domain: string } }) => {
  try {
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
