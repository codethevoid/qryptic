"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/components/layout/loader";
import { Button } from "@/components/ui/button";
import { Link2, MoreHorizontal, Pencil, UserMinus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/hooks/swr/use-user";
import { useState } from "react";
import { AddMember } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/add-member";

export const MembersClient = () => {
  const { data: team, isLoading, error } = useTeamSettings();
  const { user } = useUser();
  const [tab, setTab] = useState<"members" | "invites">("members");

  if (isLoading) return <Loader />;

  if (error) return <div>Failed to load team settings</div>;

  return (
    <>
      <AddMember />
      <div className="mt-5">
        <div className="rounded-lg border">
          {team?.members.map((member, i) => (
            <div
              key={member.id}
              className={cn(
                "flex min-w-0 items-center justify-between space-x-4 px-3 py-2.5",
                i !== 0 && "border-t",
              )}
            >
              <div className="flex min-w-0 items-center space-x-2.5">
                <Avatar className="h-8 w-8 shrink-0 border">
                  <AvatarImage src={member.user.image} alt={member.user.email} />
                  <AvatarFallback>
                    {member.user.name ? member.user.name[0] : member.user.email[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="min-w-0 truncate text-[13px]">{member.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center space-x-2.5">
                <p className="text-[13px] capitalize text-muted-foreground">{member.role}</p>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7 active:!scale-100">
                      <MoreHorizontal size={13} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.user.id !== user?.id && (
                      <DropdownMenuItem className="space-x-2">
                        <Pencil size={13} />
                        <span className="text-[13px]">Edit role</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="space-x-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500">
                      <UserMinus size={13} />
                      <span className="text-[13px]">
                        {user?.id === member.user.id ? "Leave team" : "Remove member"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
