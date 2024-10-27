import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const GET = withTeam(async ({ team, params }) => {
  try {
    const { id } = params;

    const link = await prisma.link.findUnique({
      where: { id, teamId: team.id },
      select: {
        id: true,
        destination: true,
        slug: true,
        notes: true,
        ios: true,
        android: true,
        geo: true,
        ogTitle: true,
        ogDescription: true,
        ogImage: true,
        expiresAt: true,
        expired: true,
        shouldCloak: true,
        shouldIndex: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        utmTerm: true,
        utmContent: true,
        passwordHash: true,
        domain: { select: { id: true, name: true, isPrimary: true, destination: true } },
        tags: { select: { id: true, name: true, color: true } },
        qrCode: {
          select: {
            type: true,
            logo: true,
            logoType: true,
            color: true,
            logoWidth: true,
            logoHeight: true,
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.passwordHash) link.passwordHash = "********";

    return NextResponse.json(link);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
