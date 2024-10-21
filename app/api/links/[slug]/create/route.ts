import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { checkUsage } from "@/app/api/links/[slug]/create/check-usage";
import { nanoid } from "@/utils/nanoid";
import bcrypt from "bcrypt";
import { Domain, CreateLinkBody } from "@/types/links";
import { shortDomain } from "@/lib/constants/domains";
import { uploadPreviewImage } from "@/lib/links/upload-preview-image";
import { uploadQrLogo } from "@/lib/links/upload-qr-logo";

const deepLinks = ["mailto:", "sms:", "tel:"];
const constructURL = (destination: string) => {
  if (deepLinks.some((link) => destination.startsWith(link))) {
    return destination;
  }

  if (destination.startsWith("http")) return destination;
  return `https://${destination}`;
};

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
    } = body as CreateLinkBody;

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
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
      shouldIndex = true;
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

    // create link
    const link = await prisma.link.create({
      data: {
        teamId: team.id,
        createdById: user.id,
        destination: constructURL(destination),
        slug,
        notes,
        passwordHash: password || "",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        shouldCloak,
        shouldIndex: domain.name === shortDomain ? true : shouldIndex,
        ios: ios,
        android: android,
        expired: expiredDestination ? expiredDestination : domain?.destination,
        geo,
        ogTitle: title,
        ogDescription: description,
        ogImage: image,
        domainId: domain.id,
        tags: { connect: tags.map((tag) => ({ id: tag.id })) },
      },
    });

    // create qr code
    await prisma.qrCode.create({
      data: {
        linkId: link.id,
        type: qrCodeType,
        color,
        logo,
        logoType,
        logoWidth: logoDimensions.width,
        logoHeight: logoDimensions.height,
        level: "H",
      },
    });

    return NextResponse.json({ message: "Link created successfully", slug: link.slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
