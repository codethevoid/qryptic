"use client";

import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { Loader } from "@/components/layout/loader";
import { Flag, MoreHorizontal, Tag as TagIcon, UserMinus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { CreateTeam } from "@/components/modals/create-team";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMember } from "@prisma/client";
import { toast } from "sonner";
import { ConfirmLeaveTeam } from "@/app/app.qryptic.io/(dashboard)/account/components/dialogs/confirm-leave-team";
import { Badge } from "@/components/ui/badge";
import { PlanName } from "@/types/plans";
import { PlanBadge } from "@/components/ui/custom/plan-badge";

export type Selected = {
  role: TeamMember["role"];
  team: { id: string; name: string; slug: string; image: string };
};

export const TeamsClient = () => {
  const { data: user, isLoading, error, mutate } = useUserSettings();
  const [selected, setSelected] = useState<Selected | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  console.log(user);

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to load user settings</div>;

  // optimistically updates the default team (no loading state)
  const updateDefaultTeam = async (slug: string) => {
    try {
      const res = await fetch(`/api/user/update/default-team`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newDefaultTeam: slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        return;
      }

      await mutate();
      toast.success("Default team updated");
    } catch (e) {
      toast.error("Failed to update default team");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-0.5">
          <p className="font-semibold">My teams</p>
          <p className="text-sm text-muted-foreground">You can manage your teams here</p>
        </div>
        {user?.teams.length === 0 ? (
          <TeamsEmptyState />
        ) : (
          <div className="rounded-lg border">
            {user?.teams.map((t, i) => (
              <div
                key={t.team.id}
                className={cn(
                  "flex items-center justify-between space-x-4 px-3 py-2.5",
                  i !== 0 && "border-t",
                )}
              >
                <div className="flex min-w-0 items-center space-x-2.5">
                  <Avatar className="h-8 w-8 border shadow-none">
                    <AvatarImage src={t.team.image} />
                    <AvatarFallback className="bg-transparent">
                      <Skeleton className="h-full w-full rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-[13px]">{t.team.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <PlanBadge
                    plan={t.team.plan.name as PlanName}
                    className="px-2 py-0 text-[11px]"
                  />
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                      <DropdownMenuItem
                        className="space-x-2"
                        disabled={user?.defaultTeam === t.team.slug}
                        onSelect={() => updateDefaultTeam(t.team.slug)}
                      >
                        <Flag size={14} />
                        <span className="text-[13px]">Set as default</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelected(t);
                          setIsOpen(true);
                        }}
                        className="space-x-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500"
                      >
                        <UserMinus size={14} />
                        <span className="text-[13px]">Leave team</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmLeaveTeam isOpen={isOpen} setIsOpen={setIsOpen} selected={selected} />
    </>
  );
};

const TeamsEmptyState = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex h-60 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow dark:bg-zinc-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white shadow-sm dark:from-accent/10 dark:to-accent">
            <Users size={15} />
          </div>
          <div className="space-y-0.5">
            <p className="text-center text-sm font-medium">No teams found</p>
            <p className="text-center text-[13px] text-muted-foreground">
              Create a team to get started
            </p>
          </div>
          <Button size="sm" className="w-full max-w-[200px]" onClick={() => setIsOpen(true)}>
            Create a team
          </Button>
        </div>
      </div>
      <CreateTeam isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
