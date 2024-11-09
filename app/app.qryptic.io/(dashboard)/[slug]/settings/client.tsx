"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/components/layout/loader";
import { TeamName } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/components/team-name";
import { TeamAvatar } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/components/team-avatar";
import { CompanyName } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/components/company-name";
import { DeleteTeam } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/components/delete-team";

export const GeneralSettingsClient = () => {
  const { isLoading, error } = useTeamSettings();

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to load team settings</div>;

  return (
    <div className="space-y-6">
      <TeamAvatar />
      <TeamName />
      <CompanyName />
      <DeleteTeam />
    </div>
  );
};
