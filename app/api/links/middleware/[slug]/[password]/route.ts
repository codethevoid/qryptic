import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { isAuthorized } from "@/app/api/links/middleware/is-authorized";

type Params = {
  params: {
    slug: string;
    password: string;
  };
};

export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    if (!isAuthorized(req)) {
      console.error("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, password } = params;
    if (!slug || !password) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { slug },
      select: { passwordHash: true },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, link.passwordHash as string);

    console.log(isMatch);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
