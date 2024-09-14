"use client";

import { useTeams } from "@/lib/hooks/swr/use-teams";
import { Button } from "@/components/ui/button";
import { ChartArea, Globe, Link, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { CreateTeam } from "@/components/modals/create-team";
import { useState } from "react";
import type { Plan, Team, Domain } from "@prisma/client";
import NextLink from "next/link";
import { NoTeams } from "@/components/empty/no-teams";
import { TeamSkeleton } from "@/components/skeletons/teams-skeleton";
import { PlanBadge } from "@/components/ui/custom/plan-badge";
import { PlanName } from "@/types/plans";
import { Skeleton } from "@/components/ui/skeleton";

type CustomTeam = Team & {
  plan: Plan;
  domains: Domain[];
  _count: { events: number; links: number };
};

type TeamProviderProps = {
  teams: CustomTeam[];
};

export const TeamsClient = () => {
  const { teams, error, isLoading } = useTeams();
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="text-xl font-bold">My Teams</p>
        <Button disabled={isLoading} onClick={() => setCreateTeamOpen(true)}>
          Create team
        </Button>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <TeamSkeleton />
        ) : error ? (
          "an error occured"
        ) : teams?.length === 0 ? (
          <NoTeams setCreateTeamOpen={setCreateTeamOpen} />
        ) : (
          <TeamsProvider teams={teams} />
        )}
      </div>
      <CreateTeam isOpen={isCreateTeamOpen} setIsOpen={setCreateTeamOpen} />
    </>
  );
};

export const TeamsProvider = ({ teams }: TeamProviderProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {teams.map((team, i) => (
        <NextLink href={`/${team.slug}`} key={i}>
          <Card className="space-y-5 p-4 shadow transition-all hover:shadow-lg dark:hover:border-foreground">
            <div className="flex justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={team.image as string} alt={team.name} />
                  <AvatarFallback className="bg-transparent">
                    <Skeleton className="h-full w-full rounded-full" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{team.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {team.domains.find((d) => d.isDefault)?.domain ?? "qrypt.co"}
                  </p>
                </div>
              </div>
              <div className="self-start">
                <PlanBadge plan={team.plan.name as PlanName} />
              </div>
            </div>
            <div className="flex w-fit items-center space-x-1.5 rounded-full bg-accent/70 px-3.5 py-1">
              <QrypticIcon className="h-2.5" />
              {/*<Link2 size={14} className="-rotate-45" />*/}
              <p className="text-[13px]">qryptic.io/{team.slug}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1.5">
                <ChartArea size={14} className="relative bottom-[1px]" />
                <p className="text-[13px] text-muted-foreground">
                  {team._count.events !== 0 && `${team._count.events} `}
                  {team._count.events === 1
                    ? "event"
                    : team._count.events === 0
                      ? "No events"
                      : "events"}
                </p>
              </div>
              <div className="flex items-center space-x-1.5">
                <Link size={14} className="relative bottom-[1px]" />
                <p className="text-[13px] text-muted-foreground">
                  {team._count.links !== 0 && `${team._count.links} `}
                  {team._count.links === 1
                    ? "link"
                    : team._count.links === 0
                      ? "No links"
                      : "links"}
                </p>
              </div>
            </div>
          </Card>
        </NextLink>
      ))}
    </div>
  );
};
