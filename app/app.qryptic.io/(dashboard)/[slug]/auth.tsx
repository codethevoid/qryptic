"use client";

import { ReactNode, useEffect } from "react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { TeamNotFound } from "@/components/empty/teams/team-not-found";
import { SplashLoader } from "@/components/layout/splash-loader";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const TeamAuth = ({ children }: { children: ReactNode }) => {
  const { isLoading, error, team } = useTeam();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // if no team is returned, means the user is not part of this team
    // so we can return error page instead of redirecting
    if (!team) return;
    if (!isLoading && !["super_admin", "owner"].includes(team?.user.role)) {
      if (path.includes("/settings")) router.push(`/${team?.slug || ""}`);
    }
  }, [isLoading, team, path, router]);

  if (error) return <TeamNotFound />;

  return (
    <>
      <SplashLoader isLoading={isLoading} />
      {children}
    </>
  );
};
