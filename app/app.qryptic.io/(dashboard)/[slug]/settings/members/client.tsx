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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useState } from "react";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";

const roles = [
  {
    value: "owner",
    label: "Owner",
    description: "Full access to the entire team",
  },
  {
    value: "member",
    label: "Member",
    description: "Create and edit links",
  },
];

export const MembersClient = () => {
  const { data: team, isLoading, error } = useTeamSettings();
  const { user } = useUser();
  const [role, setRole] = useState<"owner" | "member" | undefined>(undefined);
  const [tab, setTab] = useState<"members" | "invites">("members");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  if (isLoading) return <Loader />;

  if (error) return <div>Failed to load team settings</div>;

  return (
    <>
      <Card>
        <div className="flex justify-between">
          <CardHeader>
            <CardTitle>Add a teammate</CardTitle>
            <CardDescription className="text-[13px]">Invite a member to your team</CardDescription>
          </CardHeader>
          <div className="p-6">
            <Button size="sm" variant="outline" className="space-x-2" disabled={team?.plan.isFree}>
              <Link2 size={14} />
              <span>Invite link</span>
            </Button>
          </div>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" disabled={team?.plan.isFree} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value: "owner" | "member") => setRole(value)}
                disabled={team?.plan.isFree}
              >
                <SelectTrigger className={cn("font-normal", !role && "text-muted-foreground")}>
                  {role ? role.split("")[0].toUpperCase() + role.slice(1) : "Select role..."}
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                  {roles.map((item) => (
                    <SelectItem value={item.value} key={item.value}>
                      <div>
                        <p className="text-[13px]">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          {team?.plan.isFree ? (
            <p className="text-[13px] text-muted-foreground">Upgrade to add team members</p>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              Learn more about{" "}
              <a href="#" className="text-deepBlue-500 hover:underline dark:text-deepBlue-400">
                members
              </a>
            </p>
          )}
          {team?.plan.isFree ? (
            <Button size="sm" onClick={() => setIsUpgradeOpen(true)}>
              Upgrade
            </Button>
          ) : (
            <Button size="sm">Invite</Button>
          )}
        </CardFooter>
      </Card>
      {/*<div className="flex items-center justify-between">*/}
      {/*  <p className="text-lg font-bold">Members</p>*/}
      {/*  <Button size="sm" className="space-x-2">*/}
      {/*    <Link2 size={14} />*/}
      {/*    <span>Invite link</span>*/}
      {/*  </Button>*/}
      {/*</div>*/}
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
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
    </>
  );
};
