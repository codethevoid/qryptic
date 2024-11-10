"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Link2, Link, Globe, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { useState } from "react";
import { ChangePlan } from "@/components/modals/plans/change-plan/change-plan";
import { startOfMonth, format } from "date-fns";
import { Loader } from "@/components/layout/loader";

export const UsageClient = () => {
  const { data: team, isLoading, error } = useTeamSettings();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading team settings</div>;

  const UpgradeButton = () => {
    return (
      <Button
        size="sm"
        disabled={team?.plan.name === "Business"}
        onClick={() => {
          if (team?.plan.isFree) {
            setIsUpgradeOpen(true);
          } else {
            setIsChangePlanOpen(true);
          }
        }}
      >
        {team?.plan.isFree ? "Upgrade" : "Increase limits"}
      </Button>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-0.5">
          <p className="font-semibold">Usage for {team?.name}</p>
          <p className="text-sm text-muted-foreground">
            Showing data from {format(startOfMonth(new Date()), "MMM d")} -{" "}
            {format(new Date(), "MMM d")}
          </p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                  <Link size={13} />
                </span>
                <span>Custom links</span>
              </CardTitle>
              {/*<CardDescription>Links created this month</CardDescription>*/}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{team?.usage.links.toLocaleString("en-us")}</p>
                <Progress
                  className="h-1.5 max-w-[400px]"
                  value={((team?.usage.links || 0) / (team?.plan.links || 0)) * 100}
                />
                <p className="text-[13px]">
                  {team?.usage.links.toLocaleString("en-us")} of{" "}
                  {team?.plan.links.toLocaleString("en-us")} links used this month
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
              <p className="text-[13px] text-muted-foreground">Usage will reset next month</p>
              <UpgradeButton />
            </CardFooter>
          </Card>
          <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                    <Globe size={13} />
                  </span>
                  <span>Custom domains</span>
                </CardTitle>
                {/*<CardDescription>Links created this month</CardDescription>*/}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {team?.usage.domains.toLocaleString("en-us")}
                  </p>
                  <Progress
                    className="h-1.5 max-w-[400px]"
                    value={((team?.usage.domains || 0) / (team?.plan.domains || 0)) * 100}
                  />
                  <p className="text-[13px]">
                    {team?.usage.domains.toLocaleString("en-us")} of{" "}
                    {team?.plan.domains.toLocaleString("en-us")} domains used
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
                <p className="text-[13px] text-muted-foreground">Current domain usage</p>
                <UpgradeButton />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                    <User size={13} />
                  </span>
                  <span>Team members</span>
                </CardTitle>
                {/*<CardDescription>Links created this month</CardDescription>*/}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {team?.usage.members.toLocaleString("en-us")}
                  </p>
                  <Progress
                    className="h-1.5 max-w-[400px]"
                    value={((team?.usage.members || 0) / (team?.plan.seats || 0)) * 100}
                  />
                  <p className="text-[13px]">
                    {team?.usage.members.toLocaleString("en-us")} of{" "}
                    {team?.plan.seats.toLocaleString("en-us")} seats used
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
                <p className="text-[13px] text-muted-foreground">Current seat usage</p>
                <UpgradeButton />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={() => setIsUpgradeOpen(false)} />
      <ChangePlan isOpen={isChangePlanOpen} setIsOpen={() => setIsChangePlanOpen(false)} />
    </>
  );
};
