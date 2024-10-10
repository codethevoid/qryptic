import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async ({ req }) => {
  try {
    const url = req.nextUrl;
    const slugToCheck = url.searchParams.get("slugToCheck") || "";

    if (!slugToCheck) {
      return NextResponse.json({ error: "No slug provided" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { slug: slugToCheck },
      select: { id: true },
    });

    if (link) return NextResponse.json({ isAvailable: false });

    return NextResponse.json({ isAvailable: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
