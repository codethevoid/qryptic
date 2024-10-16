"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const DeviceTargeting = () => {
  const { tab } = useLinkForm();

  return (
    <div className={cn("space-y-4", tab !== "device" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="ios">iOS</Label>
        <Input placeholder="iOS destination" id="ios" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="android">Android</Label>
        <Input placeholder="Android destination" id="android" />
      </div>
    </div>
  );
};
