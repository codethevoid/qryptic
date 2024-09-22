import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

export const POST = withTeam(async ({ req }) => {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Domain name is required" }, { status: 400 });

    const data = await verifyDomain(name);
    if (data.networkError) return NextResponse.json(data, { status: 500 });

    // if domain is verified, update domain in db
    if (data.verified) {
      await prisma.domain.update({
        where: { name },
        data: { isVerified: true, lastChecked: new Date() },
      });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to verify domain" }, { status: 500 });
  }
});

async function verifyDomain(name: string) {
  try {
    // POST /v9/projects/{idOrName}/domains/{domain}/verify
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${name}/verify?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}` },
      },
    );

    return await res.json();
  } catch (e) {
    console.error(e);
    return { networkError: "Failed to verify domain" };
  }
}
