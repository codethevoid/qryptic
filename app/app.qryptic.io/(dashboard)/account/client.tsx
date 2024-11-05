"use client";

import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";

export const AccountSettingsClient = () => {
  const { isLoading, error } = useUserSettings();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load user settings</div>;

  return <div className="space-y-6"></div>;
};
