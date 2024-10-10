import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { nanoid } from "@/utils/nanoid";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async () => {
  try {
    let slug = nanoid();
    while (await prisma.link.findUnique({ where: { slug } })) {
      slug = nanoid();
    }

    return NextResponse.json({ slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
