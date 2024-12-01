import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const GET = async () => {
  try {
    const link = await prisma.link.findUnique({
      where: { slug: "rgstr" },
      select: {
        ogImage: true,
        ogTitle: true,
        ogDescription: true,
        _count: { select: { events: true } },
      },
    });

    console.log(link);

    return NextResponse.json(link);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
