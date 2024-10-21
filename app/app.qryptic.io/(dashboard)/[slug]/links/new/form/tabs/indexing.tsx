"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { cn } from "@/lib/utils";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { shortDomain } from "@/lib/constants/domains";

export const Indexing = () => {
  const { tab, shouldIndex, setShouldIndex, domain } = useLinkForm();

  useEffect(() => {
    if (domain?.name === shortDomain) {
      setShouldIndex(true);
    } else {
      setShouldIndex(false);
    }
  }, [domain]);

  return (
    <div className={cn("space-y-4", tab !== "indexing" && "hidden")}>
      <div className="flex space-x-2">
        <SmallSwitch
          id="index-link"
          className="mt-0.5"
          checked={shouldIndex}
          onCheckedChange={setShouldIndex}
        />
        <div className="-mt-1">
          <Label htmlFor="index-link">Index this link</Label>
          <p className="text-xs text-muted-foreground">
            Allow search engines to show this link in search results.
          </p>
        </div>
      </div>
    </div>
  );
};
