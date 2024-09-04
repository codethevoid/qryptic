"use client";

import { useTeams } from "@/lib/hooks/swr/use-teams";
import { Button } from "@/components/ui/button";
import { ChartArea, Link, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { CreateTeam } from "@/components/modals/create-team";
import { useState } from "react";

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
        ) : teams?.length === 0 ? (
          <NoTeams setIsOpen={setCreateTeamOpen} />
        ) : (
          <TeamsProvider />
        )}
      </div>
      <CreateTeam isOpen={isCreateTeamOpen} setIsOpen={setCreateTeamOpen} />
    </>
  );
};

export const TeamSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="space-y-5 rounded-md p-4 shadow">
          <div className="flex justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-transparent">
                  <Skeleton className="h-full w-full rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="flex h-10 flex-col justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-[22px] w-20 self-start rounded-full" />
          </div>
          <Skeleton className="h-[27.5px] max-w-[170px] rounded-full" />
          <div className="flex h-5 space-x-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export const NoTeams = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  return (
    <Card className="flex h-[300px] flex-col items-center justify-center rounded-md bg-zinc-50 p-6 shadow dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-gradient-to-tr from-background to-accent shadow-sm">
          <Users size={18} />
        </div>
        <div>
          <p className="text-center font-medium">No active teams</p>
          <p className="mt-0.5 text-center text-sm text-muted-foreground">
            Create a team to get started
          </p>
        </div>
        <Button className="w-full" onClick={() => setIsOpen(true)}>
          Create team
        </Button>
      </div>
    </Card>
  );
};

export const TeamsProvider = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="space-y-5 rounded-md p-4 shadow-md">
          <div className="flex justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-400"></AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Pryzma LLC</p>
                <p className="text-sm text-muted-foreground">qryptic.io</p>
              </div>
            </div>
            <Badge variant="primary" className="self-start">
              Business
            </Badge>
          </div>
          <div className="flex w-fit items-center space-x-1.5 rounded-full bg-accent/70 px-3.5 py-1">
            <QrypticIcon className="h-2.5" />
            {/*<Link2 size={14} className="-rotate-45" />*/}
            <p className="text-[13px]">qryptic.io/pryzma</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <ChartArea size={14} />
              <p className="text-[13px] text-muted-foreground">1.1k clicks & scans</p>
            </div>
            <div className="flex items-center space-x-1.5">
              <Link size={14} />
              <p className="text-[13px] text-muted-foreground">10k links</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
