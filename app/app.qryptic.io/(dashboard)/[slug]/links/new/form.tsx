import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FC, useEffect } from "react";
import { tabDetails } from "@/lib/links/tab-details";
import { UpgradeToPro } from "@/components/prompts/upgrade";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";

export const LinkForm: FC = () => {
  const { team } = useTeam();
  const { tab, setDestination } = useLinkForm();

  return (
    <div className="w-full">
      <div className="mb-4 space-y-1">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{tabDetails[tab].title}</p>
          <p className="text-[13px] text-muted-foreground">{tabDetails[tab].description}</p>
        </div>
      </div>
      <div className={cn("space-y-4", tab !== "general" && "hidden")}>
        <div className="space-y-1.5">
          <Label htmlFor="destination">Destination url</Label>
          <Input
            id="destination"
            placeholder="https://example.com"
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="destination">Domain and slug</Label>
          <Input id="destination" placeholder="https://example.com" />
        </div>
      </div>
      <div className={cn("space-y-4", tab !== "device" || (team?.plan.isFree && "hidden"))}></div>
      <UpgradeToPro isProFeature={tabDetails[tab].isPro} />
    </div>
  );
};
