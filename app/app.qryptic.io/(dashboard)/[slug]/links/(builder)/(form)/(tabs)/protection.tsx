"use client";

import { cn } from "@/lib/utils";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SmallSwitch } from "@/components/ui/custom/small-switch";

export const Protection = ({ mode }: { mode: "new" | "edit" }) => {
  const {
    tab,
    password,
    setPassword,
    isPasswordProtected,
    shouldDisablePassword,
    setShouldDisablePassword,
  } = useLinkForm();

  return (
    <div className={cn("space-y-4", tab !== "protection" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="password">{isPasswordProtected ? "Change password" : "Password"}</Label>
        <Input
          placeholder={isPasswordProtected ? "Change password" : "Password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      {mode === "edit" && isPasswordProtected && (
        <>
          <div className="flex space-x-2">
            <SmallSwitch
              id="disable-password"
              className="mt-0.5"
              checked={shouldDisablePassword}
              onCheckedChange={setShouldDisablePassword}
            />
            <div className="-mt-1">
              <Label htmlFor="disable-password">Disable password</Label>
              <p className="text-xs text-muted-foreground">
                You currently have a password set. Disabling it will make the link public.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
