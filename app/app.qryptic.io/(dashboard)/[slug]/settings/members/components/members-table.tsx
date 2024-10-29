import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/hooks/swr/use-user";
import { Link2 } from "lucide-react";

type Props = {};

export const MembersTable = ({}: Props) => {
  const { data: team } = useTeamSettings();
  const { user } = useUser();

  return (
    <div className="overflow-hidden rounded-lg border">
      <div
        className={
          "flex items-center justify-between border-b bg-zinc-50 px-3 py-2.5 dark:bg-zinc-950"
        }
      >
        <div className="flex items-center space-x-2">
          {/*<Checkbox*/}
          {/*  id="all-members"*/}
          {/*  disabled={team?.members.length === 1}*/}
          {/*  checked={*/}
          {/*    checked.length === (team?.members.length as number) - 1 &&*/}
          {/*    (team?.members.length as number) > 1*/}
          {/*  }*/}
          {/*  onCheckedChange={(checked: boolean) => handleCheckAll(checked)}*/}
          {/*/>*/}
          {/*<Label htmlFor="all-members">Select all ({team?.members.length})</Label>*/}
          <p className="text-[13px]">{`Members (${team?.members.length})`}</p>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal size={13} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
            <DropdownMenuItem className="space-x-2">
              <Link2 size={13} />
              <span className="text-[13px]">Invite link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {team?.members.map((member, i) => (
        <div
          key={member.id}
          className={cn(
            "flex min-w-0 items-center justify-between space-x-4 px-3 py-2.5",
            i !== 0 && "border-t",
          )}
        >
          <div className="flex min-w-0 items-center space-x-2.5">
            {/*<Checkbox disabled={member.user.id === user?.id} />*/}
            <Avatar className="h-8 w-8 shrink-0 border">
              <AvatarImage src={member.user.image} alt={member.user.email} />
              <AvatarFallback>
                {member.user.name ? member.user.name[0] : member.user.email[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="min-w-0 truncate text-[13px]">
                {member.user.name ? member.user.name : member.user.email.split("@")[0]}
              </p>
              <p className="min-w-0 truncate text-xs text-muted-foreground">{member.user.email}</p>
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
  );
};
