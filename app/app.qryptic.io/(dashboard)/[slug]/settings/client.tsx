"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/loader";

export const GeneralSettingsClient = () => {
  const { settings: team, isLoading, error } = useTeamSettings();

  if (isLoading) return <Loader />;

  if (error) return <div>Failed to load team settings</div>;

  console.log(team);

  return <div>{team?.name}</div>;
};
