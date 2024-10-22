import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { constructURL } from "@/utils/construct-url";
import { EditLinkBody } from "@/types/links";
import { nanoid } from "@/utils/nanoid";
import bcrypt from "bcrypt";
import { uploadPreviewImage } from "@/lib/links/upload-preview-image";
import { uploadQrLogo } from "@/lib/links/upload-qr-logo";
import { shortDomain } from "@/lib/constants/domains";

export const PATCH = withTeam(async ({ team, req, params }) => {
  try {
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
      shouldDisablePassword,
    } = body as EditLinkBody;

    // make sure link belongs to team
    const isAllowedToEdit = await prisma.link.findUnique({
      where: { id: params.id, teamId: team.id },
      select: { id: true },
    });

    if (!isAllowedToEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    if (!slug) {
      slug = nanoid();
      while (await prisma.link.findUnique({ where: { slug } })) {
        slug = nanoid();
      }
    }

    if (password && !shouldDisablePassword) {
      password = await bcrypt.hash(password, 10);
    }

    if (imageFile && imageType) {
      const data = await uploadPreviewImage({ imageFile, imageType, team, slug });
      if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
      }
      if (data.location) image = data.location;
    }

    if (logoType === "custom" && logoFile && logoFileType) {
      const data = await uploadQrLogo({ imageFile: logoFile, imageType: logoFileType, team, slug });
      if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
      }
      if (data.location) logo = data.location;
    }

    // update link
    const link = await prisma.link.update({
      where: { id: params.id },
      data: {
        destination: constructURL(destination),
        slug,
        notes,
        passwordHash: shouldDisablePassword ? null : password,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        shouldCloak,
        shouldIndex: domain.name === shortDomain ? true : shouldIndex,
        ios,
        android,
        expired: expiredDestination || domain.destination || `https://${shortDomain}/expired`,
        geo,
        ogTitle: title,
        ogDescription: description,
        ogImage: image,
        domainId: domain.id,
        tags: {
          set: [],
          connect: tags.map((tag) => ({ id: tag.id })),
        },
        qrCode: {
          update: {
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

    return NextResponse.json({ message: "Link updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
