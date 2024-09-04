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

type AccountDropdownProps = {
  user:
    | {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        defaultTeam: string | null;
      }
    | undefined;
};

export const AccountDropdown = ({ user }: AccountDropdownProps) => {
  const { resolvedTheme, setTheme } = useTheme();
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
          className="min-w-[180px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel>
            <p className="text-[13px] font-normal">Signed in as</p>
            <p className="text-[13px] font-normal text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="space-x-2.5">
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
