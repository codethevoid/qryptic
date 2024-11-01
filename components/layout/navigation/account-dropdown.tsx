"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Cog, LogOut, MessageCircleQuestion, Moon, PlusCircle, Sun, ThumbsUp } from "lucide-react";
import { signOut } from "next-auth/react";
import { useUser } from "@/lib/hooks/swr/use-user";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Button } from "@/components/ui/button";
import { CreateTeam } from "@/components/modals/create-team";
import { useState } from "react";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { adminRoles } from "@/utils/roles";

export const AccountDropdown = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const { team } = useTeam();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8 border transition-all hover:opacity-80">
            <AvatarImage
              src={user?.image ? user.image : undefined}
              alt={user?.name || user?.email}
            />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[240px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
          sideOffset={7}
        >
          <DropdownMenuLabel>
            <p className="max-w-[210px] truncate text-[13px] font-medium">
              {user?.name || "Signed in as"}
            </p>
            <p className="max-w-[210px] truncate text-[12px] font-medium text-muted-foreground">
              {user?.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="space-x-2.5" onSelect={() => setIsCreateTeamOpen(true)}>
            <PlusCircle size={16} />
            <span>Create team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="space-x-2.5">
            <Cog size={16} />
            <span>Account settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            <div className="hidden w-full items-center space-x-2.5 dark:flex">
              <Sun size={16} />
              <span>Light mode</span>
            </div>
            <div className="flex w-full items-center space-x-2.5 dark:hidden">
              <Moon size={16} />
              <span>Dark mode</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="space-x-2.5">
            <MessageCircleQuestion size={16} />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="space-x-2.5">
            <ThumbsUp size={16} />
            <span>Feedback</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="space-x-2.5" onSelect={() => signOut()}>
            <LogOut size={16} />
            <span>Sign out</span>
          </DropdownMenuItem>
          {team?.plan.isFree && adminRoles.includes(team?.user.role) && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Button size="sm" className="w-full" onClick={() => setIsUpgradeOpen(true)}>
                  Upgrade plan
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTeam isOpen={isCreateTeamOpen} setIsOpen={setIsCreateTeamOpen} />
      {team?.user.role === "owner" && (
        <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
      )}
    </>
  );
};
