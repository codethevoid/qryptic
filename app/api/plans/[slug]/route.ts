import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async () => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isFree: false, isLegacy: false, isCustom: false },
      select: {
        id: true,
        name: true,
        description: true,
        links: true,
        domains: true,
        seats: true,
        analytics: true,
        supportLevel: true,
        prices: {
          where: { isActive: true },
          select: { id: true, stripePriceId: true, price: true, interval: true },
        },
      },
      orderBy: { links: "asc" },
    });

    return NextResponse.json(plans);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
