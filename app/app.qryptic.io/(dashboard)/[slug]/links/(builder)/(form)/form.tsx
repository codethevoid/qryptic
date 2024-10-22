"use client";

import { FC } from "react";
import { tabDetails } from "@/lib/links/tab-details";
import { UpgradeToPro } from "@/components/prompts/upgrade";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { General } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/general";
import { QrCodeProperties } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/(qr-code)/qr-code";
import { Utm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/utm";
import { DeviceTargeting } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/device-targeting";
import { GeoTargeting } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/geo-targeting";
import { Expiration } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/expiration";
import { Preview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/preview";
import { Protection } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/protection";
import { Cloak } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/cloak";
import { Indexing } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/(tabs)/indexing";

type LinkFormProps = {
  mode: "new" | "edit";
};

export const LinkForm: FC<LinkFormProps> = ({ mode = "new" }) => {
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
      <General mode={mode} />
      <QrCodeProperties mode={mode} />
      <Utm />
      {!team?.plan.isFree && <DeviceTargeting />}
      {!team?.plan.isFree && <GeoTargeting />}
      {!team?.plan.isFree && <Expiration />}
      {!team?.plan.isFree && <Preview />}
      {!team?.plan.isFree && <Protection mode={mode} />}
      {!team?.plan.isFree && <Cloak />}
      {!team?.plan.isFree && <Indexing mode={mode} />}
      <UpgradeToPro isProFeature={tabDetails[tab].isPro} />
    </div>
  );
};
