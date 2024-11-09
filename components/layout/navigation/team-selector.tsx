"use client";

import { useTeams } from "@/lib/hooks/swr/use-teams";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import NextLink from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTeam } from "@/components/modals/create-team";
import { PlanBadge } from "@/components/ui/custom/plan-badge";
import { PlanName } from "@/types/plans";
import { CheckIcon } from "@radix-ui/react-icons";

export const TeamSelector = () => {
  const { teams, isLoading } = useTeams();
  const { slug } = useParams();
  const { team } = useTeam();
  const path = usePathname();
  const boundary = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  if (!slug) return null;

  if (isLoading) return <Skeleton className="h-5 w-5 rounded-full border" />;

  if (!team) return null;

  return (
    <>
      <div className="flex items-center space-x-2">
        <NextLink ref={boundary} href={`/${slug}`} passHref className="flex items-center space-x-2">
          <Avatar className="h-5 w-5 border">
            <AvatarImage src={team.image} alt={team.name} />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="h-full w-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <p className="max-w-[100px] truncate text-[13px] font-medium max-[768px]:max-w-[70px]">
              {team?.name}
            </p>
            <PlanBadge
              plan={team?.plan?.name as PlanName}
              className="h-[18px] px-2 text-[11px] max-[768px]:hidden"
            />
          </div>
        </NextLink>
        <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 text-muted-foreground hover:bg-accent"
            >
              <ChevronsUpDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[280px] max-w-[280px]"
            sideOffset={7}
            collisionBoundary={boundary?.current}
            align="end"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">My Teams</p>
              </div>
            </DropdownMenuLabel>
            {teams?.map((t: any) => (
              <NextLink
                href={`/${t.slug}${path?.split(team?.slug)[1] || ""}`}
                key={t.slug}
                passHref
                onClick={() => setIsOpen(false)}
              >
                <DropdownMenuItem
                  className={`flex items-center justify-between ${t.slug === slug ? "bg-accent dark:bg-accent/90" : "hover:!bg-accent/60 dark:hover:!bg-accent/40"}`}
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5 border">
                      <AvatarImage src={t.image} alt={t.name} />
                      <AvatarFallback className="bg-transparent">
                        <Skeleton className="h-full w-full" />
                      </AvatarFallback>
                    </Avatar>
                    <p
                      className={`max-w-[200px] truncate text-[13px] ${t.slug === slug ? "font-medium" : "font-normal"}`}
                    >
                      {t.name}
                    </p>
                  </div>
                  {t.slug === slug && <CheckIcon className="h-4 w-4" />}
                </DropdownMenuItem>
              </NextLink>
            ))}
            <DropdownMenuItem
              className="hover:!bg-accent/60 dark:hover:!bg-accent/40"
              onSelect={() => setIsCreateTeamOpen(true)}
            >
              <div className="flex items-center space-x-2 pl-[3px]">
                <PlusCircle size={15} />
                <p className="truncate text-[13px] font-normal">Create team</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CreateTeam isOpen={isCreateTeamOpen} setIsOpen={setIsCreateTeamOpen} />
    </>
  );
};
