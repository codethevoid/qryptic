import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { type Event } from "@/types/analytics";
import { Globe, Link2, Lock, Tag } from "lucide-react";
import { groupBy } from "@/lib/formatters/group-by";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressNumTab } from "@/components/charts/progress-num-tab";
import { Loader } from "@/components/layout/loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";

const utmParamOptions = ["Source", "Medium", "Campaign", "Term", "Content"];
type UTM = "source" | "medium" | "campaign" | "term" | "content";

const stripDestination = (destination: string) => {
  return destination.replace("https://", "").replace("http://", "");
};

type Props = {
  events: Event[] | undefined;
  isLoading: boolean;
  referrer: string | undefined;
  referrerDomain: string | undefined;
  setReferrer: (value: string | undefined) => void;
  setReferrerDomain: (value: string | undefined) => void;
  utmSource: string;
  setUtmSource: (value: string) => void;
  utmMedium: string;
  setUtmMedium: (value: string) => void;
  utmCampaign: string;
  setUtmCampaign: (value: string) => void;
  utmTerm: string;
  setUtmTerm: (value: string) => void;
  utmContent: string;
  setUtmContent: (value: string) => void;
};

export const ReferrerData = ({
  events = [],
  isLoading,
  referrer,
  setReferrer,
  referrerDomain,
  setReferrerDomain,
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
}: Props) => {
  const [stat, setStat] = useState<"referrer" | "referrerDomain" | "utm">("referrerDomain");
  const [utmStat, setUtmStat] = useState<UTM>("source");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const { team } = useTeam();
  const referrers = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "referrer");
  }, [events]);
  const referrerDomains = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "referrerDomain");
  }, [events]);
  const utmSources = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "utmSource");
  }, [events]);
  const utmMediums = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "utmMedium");
  }, [events]);
  const utmCampaigns = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "utmCampaign");
  }, [events]);
  const utmTerms = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "utmTerm");
  }, [events]);
  const utmContents = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "utmContent");
  }, [events]);

  return (
    <>
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
          <Select
            value={stat}
            onValueChange={(value: "referrer" | "referrerDomain") => setStat(value)}
          >
            <SelectTrigger className="-ml-1.5 h-8 w-auto space-x-3 border-none px-2 shadow-none hover:bg-accent dark:hover:bg-accent/60">
              <p className="text-sm font-medium">
                {stat === "referrer"
                  ? "Referrer URLs"
                  : stat === "utm"
                    ? "UTM parameters"
                    : "Referrers"}
              </p>
            </SelectTrigger>
            <SelectContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
              <SelectGroup>
                <SelectItem value="referrerDomain">Referrers</SelectItem>
                <SelectItem value="referrer">Referrer URLs</SelectItem>
                <SelectItem value="utm">UTM parameters</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {stat === "utm" ? (
            <Tag size={15} className="text-muted-foreground" />
          ) : (
            <Globe className="text-muted-foreground" size={15} />
          )}
        </div>
        {stat === "utm" && (
          <div className="flex items-center space-x-1 border-b bg-zinc-50 px-4 py-1 dark:bg-zinc-950">
            {utmParamOptions.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={"ghost"}
                className={cn(
                  "h-6 rounded-md px-2 py-0 text-xs font-normal text-muted-foreground hover:bg-zinc-200/40 dark:hover:bg-accent/60",
                  option.toLowerCase() === utmStat &&
                    "bg-zinc-200/40 text-foreground dark:bg-accent/60",
                )}
                onClick={() => setUtmStat(option.toLowerCase() as UTM)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        {isLoading ? (
          <div
            className={cn(
              "flex h-[245px] items-center justify-center p-4",
              stat === "utm" && "h-[212px]",
            )}
          >
            <Loader />
          </div>
        ) : stat === "utm" && team?.plan.isFree ? (
          <div className="flex h-[212px] flex-col items-center justify-center space-y-3 p-4">
            <Lock size={16} className="text-muted-foreground" />
            {team?.user.role === "owner" && (
              <>
                <p className="text-center text-[13px] text-muted-foreground">
                  Upgrade to <span className="font-medium text-foreground">Pro</span> to access this
                  feature
                </p>
                <Button size="sm" className="h-8" onClick={() => setIsUpgradeModalOpen(true)}>
                  Upgrade to Pro
                </Button>
              </>
            )}
            {team?.user.role !== "owner" && (
              <p className="mx-auto max-w-[200px] text-center text-[13px] text-muted-foreground">
                Ask a team owner to upgrade to{" "}
                <span className="font-medium text-foreground">Pro</span> to access this feature
              </p>
            )}
          </div>
        ) : events.length ? (
          <ScrollArea className={cn("h-[245px]", stat === "utm" && "h-[212px]")}>
            <div className="h-full py-3">
              {stat === "referrerDomain" ? (
                referrerDomains.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    url={item.url}
                    icon={<Globe size={16} className="text-muted-foreground" />}
                    onlyIcon={item.label === "direct"}
                    percent={
                      i === 0
                        ? 100
                        : item.percent === referrerDomains[0].percent
                          ? 100
                          : item.percent
                    }
                    selected={referrerDomain === item.label}
                    onClick={() => {
                      // filter events by referrerDomain
                      if (referrerDomain === item.label) {
                        setReferrerDomain(undefined);
                      } else {
                        setReferrerDomain(item.label);
                      }
                    }}
                  />
                ))
              ) : stat === "referrer" ? (
                referrers.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={stripDestination(item.label)}
                    count={item.count}
                    percent={
                      i === 0 ? 100 : item.percent === referrers[0].percent ? 100 : item.percent
                    }
                    url={item.url}
                    icon={<Globe size={16} className="text-muted-foreground" />}
                    onlyIcon={item.label === "direct"}
                    selected={referrer === item.label}
                    onClick={() => {
                      if (referrer === item.label) {
                        setReferrer(undefined);
                      } else {
                        setReferrer(item.label);
                      }
                    }}
                  />
                ))
              ) : utmStat === "source" && utmSources.length ? (
                utmSources.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    showIcon={false}
                    percent={
                      i === 0 ? 100 : item.percent === utmSources[0].percent ? 100 : item.percent
                    }
                    selected={utmSource === item.label}
                    onClick={() => {
                      if (utmSource === item.label) {
                        setUtmSource("");
                      } else {
                        setUtmSource(item.label);
                      }
                    }}
                  />
                ))
              ) : utmStat === "medium" && utmMediums.length ? (
                utmMediums.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    showIcon={false}
                    percent={
                      i === 0 ? 100 : item.percent === utmSources[0].percent ? 100 : item.percent
                    }
                    selected={utmMedium === item.label}
                    onClick={() => {
                      if (utmMedium === item.label) {
                        setUtmMedium("");
                      } else {
                        setUtmMedium(item.label);
                      }
                    }}
                  />
                ))
              ) : utmStat === "campaign" && utmCampaigns.length ? (
                utmCampaigns.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    showIcon={false}
                    percent={
                      i === 0 ? 100 : item.percent === utmCampaigns[0].percent ? 100 : item.percent
                    }
                    selected={utmCampaign === item.label}
                    onClick={() => {
                      if (utmCampaign === item.label) {
                        setUtmCampaign("");
                      } else {
                        setUtmCampaign(item.label);
                      }
                    }}
                  />
                ))
              ) : utmStat === "term" && utmTerms.length ? (
                utmTerms.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    showIcon={false}
                    percent={
                      i === 0 ? 100 : item.percent === utmTerms[0].percent ? 100 : item.percent
                    }
                    selected={utmTerm === item.label}
                    onClick={() => {
                      if (utmTerm === item.label) {
                        setUtmTerm("");
                      } else {
                        setUtmTerm(item.label);
                      }
                    }}
                  />
                ))
              ) : utmStat === "content" && utmContents.length ? (
                utmContents.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    showIcon={false}
                    percent={
                      i === 0 ? 100 : item.percent === utmContents[0].percent ? 100 : item.percent
                    }
                    selected={utmContent === item.label}
                    onClick={() => {
                      if (utmContent === item.label) {
                        setUtmContent("");
                      } else {
                        setUtmContent(item.label);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div
            className={cn(
              "flex h-[245px] items-center justify-center p-4",
              stat === "utm" && "h-[212px]",
            )}
          >
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
      <Upgrade isOpen={isUpgradeModalOpen} setIsOpen={setIsUpgradeModalOpen} />
    </>
  );
};
