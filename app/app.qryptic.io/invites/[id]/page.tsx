import { constructMetadata } from "@/utils/construct-metadata";
import prisma from "@/db/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { InviteClient } from "@/app/app.qryptic.io/invites/[id]/client";

type Props = {
  params: { id: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const invite = await prisma.invite.findUnique({
    where: { id: params.id },
    select: { team: { select: { name: true } } },
  });

  if (!invite) return constructMetadata({});

  return constructMetadata({
    title: `Qryptic | Join team ${invite.team.name}`,
  });
};

const InvitePage = async ({ params }: Props) => {
  const invite = await prisma.invite.findUnique({
    where: { id: params.id },
    select: { team: { select: { name: true, id: true, image: true, slug: true } } },
  });

  if (!invite) return notFound();

  return <InviteClient invite={invite} />;
};

export default InvitePage;
