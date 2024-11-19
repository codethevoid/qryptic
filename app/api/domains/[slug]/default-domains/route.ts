import { NextResponse } from "next/server";
import { withTeam } from "@/lib/auth/with-team";
import prisma from "@/db/prisma";

type Domain = {
  id: string;
  name: string;
  enabled: boolean;
  isExclusive: boolean;
};

export const GET = withTeam(async ({ team }) => {
  try {
    const domains = await prisma.domain.findMany({
      where: { isDefault: true },
      select: {
        id: true,
        name: true,
        isExclusive: true,
        enabledTeams: { where: { id: team.id } },
      },
    });

    const mappedDomains: Domain[] = domains.map((domain) => {
      const enabled = domain.enabledTeams.length > 0;
      const { enabledTeams, ...rest } = domain;
      return { enabled, ...rest };
    });

    return NextResponse.json(mappedDomains);
  } catch (e) {
    console.error("Error getting default domains: ", e);
    return NextResponse.json({ error: "Error getting default domains" }, { status: 500 });
  }
});
