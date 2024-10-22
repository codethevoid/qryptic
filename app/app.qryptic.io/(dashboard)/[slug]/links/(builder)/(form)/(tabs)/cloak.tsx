"use client";

import { cn } from "@/lib/utils";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useIframe } from "@/lib/hooks/swr/use-iframe";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import { useEffect } from "react";
import { Flag, LoaderCircle, ShieldX } from "lucide-react";
import { Label } from "@/components/ui/label";

export const Cloak = () => {
  const { tab, destination, shouldCloak, setShouldCloak } = useLinkForm();
  const debouncedDestination = useDebounce(destination, 500);

  const { data, isLoading, error } = useIframe(debouncedDestination);

  useEffect(() => {
    if (!data?.isCloakable) setShouldCloak(false);
  }, [data]);

  return (
    <div className={cn("space-y-4", tab !== "cloaking" && "hidden")}>
      {!destination ? (
        <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
          <div className="space-y-4">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white dark:from-accent/10 dark:to-accent">
              <Flag size={15} />
            </div>
            <div className="space-y-0.5">
              <p className="text-center text-[13px] font-medium">No destination URL</p>
              <p className="text-center text-xs text-muted-foreground">
                Enter a destination to cloak the URL
              </p>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <LoaderCircle size={15} className="animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p>An error occured</p>
      ) : data?.isCloakable ? (
        <div className="flex space-x-2">
          <SmallSwitch
            id="cloak-switch"
            className="mt-0.5"
            checked={shouldCloak}
            onCheckedChange={setShouldCloak}
          />
          <div className="-mt-1">
            <Label htmlFor="cloak-switch">Cloak destination URL</Label>
            <p className="text-xs text-muted-foreground">
              The URL shown in the browser will be the short link.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
          <div className="space-y-4">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white dark:from-accent/10 dark:to-accent">
              <ShieldX size={15} />
            </div>
            <div className="space-y-0.5">
              <p className="text-center text-[13px] font-medium">URL is not cloakable</p>
              <p className="text-center text-xs text-muted-foreground">
                We are unable to cloak this URL due to restrictions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
