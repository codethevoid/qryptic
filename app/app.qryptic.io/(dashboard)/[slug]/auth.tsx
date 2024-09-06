"use client";

import { ReactNode, useEffect } from "react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { TeamNotFound } from "@/components/empty/team-not-found";
import { SplashLoader } from "@/components/layout/splash-loader";
import { useState } from "react";

export const TeamAuth = ({ children }: { children: ReactNode }) => {
  const { isLoading, error } = useTeam();

  // if (isLoading) return <SplashLoader isLoading={isLoading} />;

  if (error) return <TeamNotFound />;

  return (
    <>
      <SplashLoader isLoading={isLoading} />
      {children}
    </>
  );
};
