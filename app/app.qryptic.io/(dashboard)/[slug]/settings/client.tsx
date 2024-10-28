"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/components/layout/loader";

export const GeneralSettingsClient = () => {
  const { data: team, isLoading, error } = useTeamSettings();

  if (isLoading) return <Loader />;

  if (error) return <div>Failed to load team settings</div>;

  return <div>{team?.name}</div>;
};
