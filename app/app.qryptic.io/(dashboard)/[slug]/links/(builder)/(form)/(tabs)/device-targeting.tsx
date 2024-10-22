"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const DeviceTargeting = () => {
  const { tab, ios, setIos, android, setAndroid } = useLinkForm();

  return (
    <div className={cn("space-y-4", tab !== "device" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="ios">iOS destination</Label>
        <Input
          placeholder="https://apps.apple.com"
          id="ios"
          value={ios}
          onChange={(e) => setIos(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="android">Android destination</Label>
        <Input
          placeholder="https://play.google.com"
          id="android"
          value={android}
          onChange={(e) => setAndroid(e.target.value)}
        />
      </div>
    </div>
  );
};
