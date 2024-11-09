import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { uploadImage } from "@/utils/upload-image";
import { nanoid } from "@/utils/nanoid";

export const PATCH = withSession(async ({ user, req }) => {
  try {
    const body = await req.formData();
    const file = body.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Please select an image" }, { status: 400 });
    }

    const maxSize = 2 * 1024 * 1024; // 2mb
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 2mb" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const location = await uploadImage(
      buffer,
      `avatars/${user.id}/${nanoid(8)}.${file.type.split("/")[1]}`,
      file.type,
    );

    if (!location) {
      return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { image: location },
    });

    return NextResponse.json({ message: "User avatar has been updated" });
  } catch (e) {
    console.error("Error updating user avatar: ", e);
    return NextResponse.json({ error: "Error updating user avatar" }, { status: 500 });
  }
});
