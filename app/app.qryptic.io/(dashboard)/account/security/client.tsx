"use client";

import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { Loader } from "@/components/layout/loader";
import { Password } from "@/app/app.qryptic.io/(dashboard)/account/components/password";

export const SecurityClient = () => {
  const { isLoading, error } = useUserSettings();

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to load user settings</div>;

  return <Password />;
};
