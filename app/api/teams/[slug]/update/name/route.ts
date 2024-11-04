import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { z } from "zod";
import { withTeamOwner } from "@/lib/auth/with-team-owner";

const teamNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Team name is required" })
    .max(28, { message: "Team name must no more than 28 characters" })
    .describe("The name of the team"),
});

export const PATCH = withTeamOwner(async ({ team, req }) => {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // validate name
    const isValidName = teamNameSchema.safeParse({ name: name.trim() });
    if (!isValidName.success) {
      return NextResponse.json({ error: isValidName.error.errors[0].message }, { status: 400 });
    }

    // generate team slug based on team name and make it URL friendly
    // let slug = name
    //   .toLowerCase()
    //   .replace(/[^a-z0-9]+/g, "-")
    //   .replace(/^-+|-+$/g, "")
    //   .trim();
    // if (slug !== team.slug) {
    //   while (await prisma.team.findUnique({ where: { slug } })) {
    //     slug = `${slug}-${nanoid(4)}`;
    //   }
    // }

    await prisma.team.update({
      where: { id: team.id },
      data: { name: name.trim() },
    });

    return NextResponse.json({});
  } catch (e) {
    console.error("Error updating team name: ", e);
    return NextResponse.json({ error: "Error updating team name" }, { status: 500 });
  }
});
