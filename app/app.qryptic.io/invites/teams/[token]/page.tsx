import { constructMetadata } from "@/utils/construct-metadata";
import prisma from "@/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamInviteClient } from "@/app/app.qryptic.io/invites/teams/[token]/client";

type Props = {
  params: { token: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const team = await prisma.team.findUnique({
    where: { inviteToken: params.token },
    select: { id: true, name: true, image: true, slug: true },
  });

  if (!team) return constructMetadata({});

  return constructMetadata({
    title: `Qryptic | Join team ${team.name}`,
  });
};

const TeamInvitePage = async ({ params }: Props) => {
  const team = await prisma.team.findUnique({
    where: { inviteToken: params.token },
    select: { id: true, name: true, image: true, slug: true },
  });

  if (!team) return notFound();

  return <TeamInviteClient team={team} />;
};

export default TeamInvitePage;
