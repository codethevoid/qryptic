"use client";

import { cn } from "@/lib/utils";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useIframe } from "@/lib/hooks/swr/use-iframe";
import { SmallSwitch } from "@/components/ui/custom/small-switch";

export const Cloak = () => {
  const { tab, destination, shouldCloak, setShouldCloak } = useLinkForm();
  const debouncedDestination = useDebounce(destination, 500);

  const { data, isLoading, error } = useIframe(debouncedDestination);

  console.log(data);

  return (
    <div className={cn("space-y-4", tab !== "cloaking" && "hidden")}>
      {isLoading ? (
        <div>loading...</div>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data?.isCloakable ? (
        <div>
          <p className="text-[13px] font-medium">Cloaked URL</p>
        </div>
      ) : (
        <div>URL is not cloakable</div>
      )}
    </div>
  );
};
