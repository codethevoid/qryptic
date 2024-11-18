import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";
import { Domain, Plan } from "@prisma/client";

type DomainsAndPlan = {
  domains: Domain[];
  plan: Plan;
};

export const POST = withTeam(async ({ req, team }) => {
  try {
    const body = await req.json();
    let { name, destination } = body;
    if (!name) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    name = name.toLowerCase().replace("www.", "").trim();

    // get domains and plan limits
    const { domains, plan } = (await prisma.team.findUnique({
      where: { id: team.id },
      select: { domains: { where: { isArchived: false } }, plan: true },
    })) as DomainsAndPlan;

    // check if team can create another domain
    if (domains.length >= plan.domains) {
      return NextResponse.json(
        {
          error: `You can only have ${plan.domains} domain${!plan.isFree ? "s" : ""} on your current plan.`,
        },
        { status: 400 },
      );
    }

    // check if domain name is already in use
    if (await prisma.domain.findUnique({ where: { name } })) {
      return NextResponse.json({ error: "Domain name is already in use" }, { status: 400 });
    }

    // attempt to create domain to project in vercel
    const domainAdded = await addDomainToVercel(name);
    if (!domainAdded)
      return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });

    // create domain in db
    await prisma.domain.create({
      data: {
        team: { connect: { id: team.id } },
        name,
        destination: !plan.isFree ? destination?.toLowerCase().trim() || null : null,
        isPrimary: domains.length === 0,
        isSubdomain: isSubdomain(name),
      },
    });

    return NextResponse.json({ message: "Domain added successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });
  }
});

// Helper functions

function isSubdomain(name: string) {
  const subdomainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  return subdomainRegex.test(name);
}

async function addDomainToVercel(name: string) {
  try {
    // POST /v10/projects/{idOrName}/domains
    const isSubdomainName = isSubdomain(name);
    const body = {
      name: isSubdomainName ? name : `www.${name}`,
      ...(!isSubdomainName && { redirect: name }),
    };
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}` },
        body: JSON.stringify(body),
      },
    );

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}
