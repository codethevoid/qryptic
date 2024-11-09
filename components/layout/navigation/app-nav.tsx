"use client";

import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { AccountDropdown } from "@/components/layout/navigation/account-dropdown";
import { TeamSelector } from "@/components/layout/navigation/team-selector";
import { useParams } from "next/navigation";
import { useTeam } from "@/lib/hooks/swr/use-team";
import NextLink from "next/link";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { useState } from "react";
import { NavLinks } from "@/components/layout/navigation/nav-links";
import { useInView } from "react-intersection-observer";
import { adminRoles } from "@/utils/roles";
import { QrypticIcon } from "@/components/logos/qryptic-icon";

export const AppNav = () => {
  const { slug } = useParams();
  const { team } = useTeam();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const { ref, inView } = useInView();

  return (
    <>
      <div ref={ref} className={!slug || !team ? "sticky top-0 z-40" : "undefined"}>
        <div className="border-b border-border/70 bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
          <MaxWidthWrapper className="flex items-center justify-between">
            <div className="flex items-center space-x-5 max-[768px]:space-x-3">
              <NextLink href="/teams" passHref>
                <QrypticLogo className="max-[768px]:hidden" />
                <QrypticIcon className="min-[768px]:hidden" />
              </NextLink>
              {slug && team && (
                <div className="h-5 w-[1px] rotate-[30deg] border-r border-dashed border-zinc-400 dark:border-zinc-600 max-[768px]:h-4"></div>
              )}
              <TeamSelector />
            </div>
            <div className="flex items-center space-x-2.5">
              {team?.plan.isFree && adminRoles.includes(team?.user.role) && (
                <Button size="sm" onClick={() => setIsUpgradeOpen(true)}>
                  Upgrade
                </Button>
              )}
              <Button size="sm" variant="outline" className="shadow-none max-[768px]:hidden">
                Feedback
              </Button>
              {/* <Button size="icon" variant="outline" className="shadow-none">
                <Bell size={14} />
              </Button> */}
              <AccountDropdown />
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
      <NavLinks inView={inView} />
      {/*<VerifyEmailAlert isLoading={isUserLoading} isEmailVerified={user?.isEmailVerified} />*/}
      {team?.user.role === "owner" && (
        <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
      )}
    </>
  );
};
