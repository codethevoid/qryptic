import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";

export const POST = withTeam(async ({ req }) => {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "Domain name is required" }, { status: 400 });

    const config = await getDomainConfig(name);
    if (config.error) return NextResponse.json({ error: config.error }, { status: 500 });

    return NextResponse.json(config);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get domain config" }, { status: 500 });
  }
});

async function getDomainConfig(name: string) {
  try {
    // GET /v6/domains/{domain}/config
    const res = await fetch(
      `https://api.vercel.com/v6/domains/${name}/config?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: { Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}` },
      },
    );

    return await res.json();
  } catch (e) {
    console.error(e);
    return { error: "Failed to get domain config" };
  }
}
