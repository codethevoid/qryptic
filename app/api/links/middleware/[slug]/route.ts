import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { MiddlewareLink } from "@/types/links";

const isAuthorized = (req: NextRequest) => {
  const bearer = req.headers.get("authorization");
  const token = bearer?.split(" ")[1];
  return token === process.env.QRYPTIC_API_KEY;
};

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  try {
    if (!isAuthorized(req)) {
      console.error("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const link = (await prisma.link.findUnique({
      where: { slug },
      select: {
        id: true,
        teamId: true,
        destination: true,
        passwordHash: true,
        expiresAt: true,
        shouldCloak: true,
        shouldIndex: true,
        isBanned: true,
        ios: true,
        android: true,
        expired: true,
        geo: true,
        domain: { select: { id: true, destination: true } },
      },
    })) as MiddlewareLink;

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    link.isPasswordProtected = !!link.passwordHash;
    if (link.isPasswordProtected) link.destination = "";

    return NextResponse.json({ link });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
