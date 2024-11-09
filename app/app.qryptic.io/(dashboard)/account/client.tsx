"use client";

import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { UserAvatar } from "@/app/app.qryptic.io/(dashboard)/account/components/user-avatar";
import { UserName } from "@/app/app.qryptic.io/(dashboard)/account/components/user-name";
import { UserEmail } from "@/app/app.qryptic.io/(dashboard)/account/components/user-email";
import { DeleteUser } from "@/app/app.qryptic.io/(dashboard)/account/components/delete-user";
import { Loader } from "@/components/layout/loader";

export const AccountSettingsClient = () => {
  const { isLoading, error } = useUserSettings();

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to load user settings</div>;

  return (
    <div className="space-y-6">
      <UserAvatar />
      <UserName />
      <UserEmail />
      <DeleteUser />
    </div>
  );
};
