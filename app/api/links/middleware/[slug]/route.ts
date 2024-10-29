import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { MiddlewareLink } from "@/types/links";
import { isAuthorized } from "@/app/api/links/middleware/is-authorized";

export const POST = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  try {
    if (!isAuthorized(req)) {
      console.error("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // get domain from request body
    // we need to check if the domain and slug match
    // so people can't just use other peoples domains for their links
    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const link = (await prisma.link.findUnique({
      where: { slug, domain: { name: { equals: domain } } },
      select: {
        id: true,
        teamId: true,
        destination: true,
        passwordHash: true,
        expiresAt: true,
        shouldCloak: true,
        shouldIndex: true,
        shouldProxy: true,
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

    return NextResponse.json({ link });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
