"use client";

import { useTeams } from "@/lib/hooks/swr/use-teams";
import { Button } from "@/components/ui/button";
import { ChartArea, Globe, Link, Link2, MousePointerClick, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { CreateTeam } from "@/components/modals/create-team";
import { useState } from "react";
import NextLink from "next/link";
import { NoTeams } from "@/components/empty/teams/no-teams";
import { TeamSkeleton } from "@/components/skeletons/teams-skeleton";
import { PlanBadge } from "@/components/ui/custom/plan-badge";
import { PlanName } from "@/types/plans";
import { Skeleton } from "@/components/ui/skeleton";
import { appDomain, shortDomain } from "@/utils/qryptic/domains";
import { type Team } from "@/lib/hooks/swr/use-teams";

export const TeamsClient = () => {
  const { teams, error, isLoading } = useTeams();
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="text-xl font-bold">My Teams</p>
        <Button disabled={isLoading} onClick={() => setCreateTeamOpen(true)} size="sm">
          Create team
        </Button>
      </div>
      <div className="mt-6 max-md:mt-3">
        {isLoading ? (
          <TeamSkeleton />
        ) : error ? (
          "an error occured"
        ) : teams?.length === 0 ? (
          <NoTeams setCreateTeamOpen={setCreateTeamOpen} />
        ) : (
          <TeamsProvider teams={teams as Team[]} />
        )}
      </div>
      <CreateTeam isOpen={isCreateTeamOpen} setIsOpen={setCreateTeamOpen} />
    </>
  );
};

export const TeamsProvider = ({ teams }: { teams: Team[] }) => {
  return (
    <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {teams.map((team, i) => (
        <NextLink href={`/${team.slug}`} key={i}>
          <Card className="space-y-5 p-4 shadow-sm transition-all hover:shadow-lg dark:hover:border-foreground">
            <div className="flex justify-between space-x-3">
              <div className="flex min-w-0 items-center space-x-3">
                <Avatar className="h-10 w-10 shrink-0 border">
                  <AvatarImage src={team.image as string} alt={team.name} />
                  <AvatarFallback className="bg-transparent">
                    <Skeleton className="h-full w-full rounded-full" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{team.name}</p>
                  <p className="truncate text-[13px] text-muted-foreground">
                    {team.domains.find((d) => d.isPrimary)?.name ?? shortDomain}
                  </p>
                </div>
              </div>
              <div className="flex self-start">
                <PlanBadge plan={team.plan.name as PlanName} />
              </div>
            </div>
            <div className="flex min-w-0 max-w-fit items-center space-x-1.5 rounded-full bg-accent/70 px-3.5 py-1">
              <QrypticIcon className="h-2.5 shrink-0" />
              {/*<Link2 size={14} className="-rotate-45" />*/}
              <p className="truncate text-xs">
                {appDomain}/{team.slug}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1.5">
                <Link2 size={14} className="relative bottom-[1px]" />
                <p className="text-[13px] text-muted-foreground">
                  {team._count.links !== 0 && `${team._count.links.toLocaleString("en-us")} `}
                  {team._count.links === 1
                    ? "link"
                    : team._count.links === 0
                      ? "No links"
                      : "links"}
                </p>
              </div>
              <div className="flex items-center space-x-1.5">
                <MousePointerClick size={14} className="relative bottom-[1px]" />
                <p className="text-[13px] text-muted-foreground">
                  {team._count.events !== 0 && `${team._count.events.toLocaleString("en-us")} `}
                  {team._count.events === 1
                    ? "event"
                    : team._count.events === 0
                      ? "No events"
                      : "events"}
                </p>
              </div>
            </div>
          </Card>
        </NextLink>
      ))}
    </div>
  );
};
