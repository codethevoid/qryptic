import { startOfMonth } from "date-fns";
import prisma from "@/db/prisma";

type TeamUsage = {
  _count: { links: number };
  plan: { links: number };
} | null;

export const checkUsage = async (teamId: string) => {
  const from = startOfMonth(new Date());

  const team: TeamUsage = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      plan: { select: { links: true } },
      _count: {
        select: {
          links: {
            where: {
              createdAt: {
                gte: from,
              },
            },
          },
        },
      },
    },
  });

  if (team) console.log(team._count.links);

  if (team) return team._count.links >= team.plan.links;
  return false;
};
