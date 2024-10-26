import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { type Event } from "@/types/analytics";
import { Globe, Link2 } from "lucide-react";
import { groupBy } from "@/lib/formatters/group-by";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressNumTab } from "@/components/charts/progress-num-tab";
import { Loader } from "@/components/layout/loader";

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
};

export const ReferrerData = ({
  events = [],
  isLoading,
  referrer,
  setReferrer,
  referrerDomain,
  setReferrerDomain,
}: Props) => {
  const [stat, setStat] = useState<"referrer" | "referrerDomain">("referrerDomain");
  const referrers = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "referrer");
  }, [events]);
  const referrerDomains = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "referrerDomain");
  }, [events]);

  return (
    <div className="overflow-hidden rounded-lg border shadow">
      <div className="flex items-center justify-between border-b bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
        <Select
          value={stat}
          onValueChange={(value: "referrer" | "referrerDomain") => setStat(value)}
        >
          <SelectTrigger className="-ml-1.5 h-8 w-auto space-x-3 border-none px-2 shadow-none hover:bg-accent dark:hover:bg-accent/60">
            <p className="text-sm font-medium">
              {stat === "referrer" ? "Referrer URLs" : "Referrers"}
            </p>
          </SelectTrigger>
          <SelectContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              <SelectItem value="referrerDomain">Referrers</SelectItem>
              <SelectItem value="referrer">Referrer URLs</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Globe className="text-muted-foreground" size={15} />
      </div>
      {isLoading ? (
        <div className="flex h-[245px] items-center justify-center p-4">
          <Loader />
        </div>
      ) : events.length ? (
        <ScrollArea className="h-[245px]">
          <div className="py-3">
            {stat === "referrerDomain"
              ? referrerDomains.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    url={item.url}
                    icon={<Globe size={16} />}
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
              : referrers.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={stripDestination(item.label)}
                    count={item.count}
                    percent={
                      i === 0 ? 100 : item.percent === referrers[0].percent ? 100 : item.percent
                    }
                    url={item.url}
                    icon={<Globe size={16} />}
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
                ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex h-[245px] items-center justify-center p-4">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
};
