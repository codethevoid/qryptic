"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { cn } from "@/lib/utils";

export const Utm = () => {
  const {
    tab,
    utmSource,
    setUtmSource,
    utmMedium,
    setUtmMedium,
    utmCampaign,
    setUtmCampaign,
    utmTerm,
    setUtmTerm,
    utmContent,
    setUtmContent,
    destination,
    setDestination,
  } = useLinkForm();

  const handleUtmChange = (name: string, value: string) => {
    if (!destination) return;
    const searchParams = new URLSearchParams(destination.split("?")[1]);
    value ? searchParams.set(name, value) : searchParams.delete(name);
    const searchString = searchParams.toString().length ? `?${searchParams.toString()}` : "";
    const path = destination.split("?")[0].endsWith("/")
      ? destination.split("?")[0].slice(0, -1)
      : destination.split("?")[0];
    setDestination(`${path}${searchString}`);
  };

  return (
    <div className={cn("space-y-4", tab !== "utm" && "hidden")}>
      <div className="space-y-2 rounded-lg border p-3 shadow-sm">
        <p className="text-[13px] font-medium">Destination preview</p>
        <div className="rounded-md border bg-zinc-50 p-2 dark:bg-zinc-950">
          <p className="break-all text-xs text-muted-foreground">
            {destination ? destination : "No destination provided"}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="utm-source">Source</Label>
        <Input
          placeholder="google"
          id="utm-source"
          value={utmSource}
          onChange={(e) => {
            setUtmSource(e.target.value);
            handleUtmChange("utm_source", e.target.value);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="utm-medium">Medium</Label>
        <Input
          placeholder="social"
          id="utm-medium"
          value={utmMedium}
          onChange={(e) => {
            setUtmMedium(e.target.value);
            handleUtmChange("utm_medium", e.target.value);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="utm-campaign">Campaign</Label>
        <Input
          placeholder="christmas_sale"
          id="utm-campaign"
          value={utmCampaign}
          onChange={(e) => {
            setUtmCampaign(e.target.value);
            handleUtmChange("utm_campaign", e.target.value);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="utm-term">Term</Label>
        <Input
          placeholder="keyword"
          id="utm-term"
          value={utmTerm}
          onChange={(e) => {
            setUtmTerm(e.target.value);
            handleUtmChange("utm_term", e.target.value);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="utm-content">Content</Label>
        <Input
          placeholder="hero_banner"
          id="utm-content"
          value={utmContent}
          onChange={(e) => {
            setUtmContent(e.target.value);
            handleUtmChange("utm_content", e.target.value);
          }}
        />
      </div>
    </div>
  );
};
