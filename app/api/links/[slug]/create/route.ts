import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { checkUsage } from "@/app/api/links/[slug]/create/check-usage";
import { nanoid } from "@/utils/nanoid";
import bcrypt from "bcrypt";
import { Domain, CreateLinkBody } from "@/types/links";
import { shortDomain } from "@/utils/qryptic/domains";
import { uploadPreviewImage } from "@/lib/links/upload-preview-image";
import { uploadQrLogo } from "@/lib/links/upload-qr-logo";
import { constructURL } from "@/utils/construct-url";
import { blacklist } from "@/utils/blacklist";

export const POST = withTeam(async ({ team, req, user }) => {
  try {
    const isOverLimit = await checkUsage(team.id);
    if (isOverLimit) {
      return NextResponse.json({ error: "You have reached your link limit" }, { status: 400 });
    }

    const body = await req.json();
    let {
      destination,
      domain,
      slug,
      tags,
      notes,
      qrCodeType,
      logo,
      logoType,
      logoFile,
      logoFileType,
      color,
      logoDimensions,
      ios,
      android,
      geo,
      expiresAt,
      expiredDestination,
      title,
      description,
      image,
      imageFile,
      imageType,
      password,
      shouldCloak,
      shouldIndex,
      shouldProxy,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    } = body as CreateLinkBody;

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    const teamWithPlan = await prisma.team.findUnique({
      where: { id: team.id },
      select: { plan: { select: { isFree: true } } },
    });

    if (teamWithPlan?.plan.isFree) {
      // we will not allow free teams to create slugs that are less than 3 characters
      if (slug.length < 3) {
        return NextResponse.json(
          { error: "Upgrade to a paid plan to create slugs less than 3 characters" },
          { status: 400 },
        );
      }
    }

    if (!domain) {
      // get default domain for qryptic
      domain = (await prisma.domain.findFirst({
        where: {
          isDefault: true,
          isArchived: false,
        },
        select: {
          id: true,
          name: true,
          destination: true,
          isPrimary: true,
        },
      })) as Domain;
    }

    // check if slug exists and if it is taken
    while (!slug || (await prisma.link.findUnique({ where: { slug } }))) {
      slug = nanoid();
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    // upload image preview for open graph
    if (imageFile && imageType) {
      const data = await uploadPreviewImage({ imageFile, imageType, team, slug });
      if (data?.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
      }
      if (data.location) image = data.location;
    }

    // upload custom logo for qr code if it exists
    if (logoType === "custom" && logoFile && logoFileType) {
      const data = await uploadQrLogo({ imageFile: logoFile, imageType: logoFileType, team, slug });
      if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
      }
      if (data.location) logo = data.location;
    }

    shouldIndex = domain.name === shortDomain ? true : shouldIndex;

    // Check if destination is blacklisted
    if (blacklist.some((item) => destination.toLowerCase().trim().includes(item))) {
      return NextResponse.json({ error: "Destination is blacklisted" }, { status: 400 });
    }

    // Check if any geo destination is blacklisted
    if (
      Object.values(geo).some((value) =>
        blacklist.some((item) => value.destination.toLowerCase().trim().includes(item)),
      )
    ) {
      return NextResponse.json({ error: "Geo destination is blacklisted" }, { status: 400 });
    }

    // Check if android or ios destination is blacklisted
    if (android && blacklist.some((item) => android.toLowerCase().trim().includes(item))) {
      return NextResponse.json({ error: "Android destination is blacklisted" }, { status: 400 });
    }

    if (ios && blacklist.some((item) => ios.toLowerCase().trim().includes(item))) {
      return NextResponse.json({ error: "iOS destination is blacklisted" }, { status: 400 });
    }

    // create link
    const link = await prisma.link.create({
      data: {
        teamId: team.id,
        userId: user.userId, // make it the user id so in case the user is deleted we can still track who created the link
        destination: constructURL(destination),
        slug,
        notes,
        passwordHash: password,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        shouldCloak,
        shouldIndex,
        shouldProxy,
        ios,
        android,
        expired: expiredDestination || domain.destination,
        geo,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        ogTitle: title,
        ogDescription: description,
        ogImage: image,
        domainId: domain.id,
        tags: { connect: tags.map((tag) => ({ id: tag.id })) },
        qrCode: {
          create: {
            type: qrCodeType,
            color,
            logo,
            logoType,
            logoWidth: logoDimensions.width,
            logoHeight: logoDimensions.height,
            level: "H",
          },
        },
      },
    });

    return NextResponse.json({ message: "Link created successfully", slug: link.slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
