import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { tabDetails } from "@/lib/links/tab-details";
import { type Tab } from "@/types/links";
import { UpgradeToPro } from "@/components/prompts/upgrade";
import { useTeam } from "@/lib/hooks/swr/use-team";

type LinkFormProps = {
  tab: Tab;
};

export const LinkForm: FC<LinkFormProps> = ({ tab }) => {
  const { team } = useTeam();
  return (
    <div className="w-full">
      <div className="mb-4 space-y-1">
        {/*<div className="flex items-center space-x-1">*/}
        {/*  <p className="text-[13px] text-muted-foreground">Link</p>*/}
        {/*  <ChevronRight size={12} className="text-muted-foreground" />*/}
        {/*  <p className="text-[13px]">{tabDetails[tab].title}</p>*/}
        {/*</div>*/}
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{tabDetails[tab].title}</p>
          <p className="text-[13px] text-muted-foreground">{tabDetails[tab].description}</p>
        </div>
      </div>
      <div className={cn("space-y-4", tab !== "general" && "hidden")}>
        <div className="space-y-1.5">
          <Label htmlFor="destination">Destination url</Label>
          <Input id="destination" placeholder="https://example.com" />
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
