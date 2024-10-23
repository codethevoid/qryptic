import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { linkId, ua, eventType, ip, location } = body;
    console.log(linkId, ua, eventType, ip, location);
    const link = await prisma.link.findUnique(
      { where: { id: linkId } },
      {
        select: { domain: { select: { id: true }, teamId: true } },
      },
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
