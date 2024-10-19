import { cn } from "@/lib/utils";
import { FC } from "react";
import { tabDetails } from "@/lib/links/tab-details";
import { UpgradeToPro } from "@/components/prompts/upgrade";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { General } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/general";
import { QrCodeProperties } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/qr-code/qr-code";
import { Utm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/utm";
import { DeviceTargeting } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/device-targeting";
import { GeoTargeting } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/geo-targeting";
import { Expiration } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/expiration";
import { Preview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/preview";
import { Protection } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/protection";
import { Cloak } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/cloak";

export const LinkForm: FC = () => {
  const { team } = useTeam();
  const { tab } = useLinkForm();

  return (
    <div className="w-full min-w-0">
      <div className="mb-4 space-y-1">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{tabDetails[tab].title}</p>
          <p className="text-[13px] text-muted-foreground">{tabDetails[tab].description}</p>
        </div>
      </div>
      <General />
      <QrCodeProperties />
      <Utm />
      {!team?.plan.isFree && <DeviceTargeting />}
      {!team?.plan.isFree && <GeoTargeting />}
      {!team?.plan.isFree && <Expiration />}
      {!team?.plan.isFree && <Preview />}
      {!team?.plan.isFree && <Protection />}
      {!team?.plan.isFree && <Cloak />}
      <UpgradeToPro isProFeature={tabDetails[tab].isPro} />
    </div>
  );
};
