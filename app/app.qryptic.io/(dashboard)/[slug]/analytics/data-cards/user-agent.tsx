import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { type Event } from "@/types/analytics";
import { Box, Compass, Globe, Link2, MonitorSmartphone } from "lucide-react";
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
  browser: string | undefined;
  setBrowser: (value: string | undefined) => void;
  os: string | undefined;
  setOs: (value: string | undefined) => void;
  deviceType: string | undefined;
  setDeviceType: (value: string | undefined) => void;
};

export const UserAgentData = ({
  events = [],
  isLoading,
  browser,
  setBrowser,
  os,
  setOs,
  deviceType,
  setDeviceType,
}: Props) => {
  const [stat, setStat] = useState<"browser" | "deviceType" | "os">("browser");
  const browsers = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "browser");
  }, [events]);
  const deviceTypes = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "deviceType");
  }, [events]);
  const oss = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "os");
  }, [events]);

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div className="flex items-center justify-between border-b bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
        <Select
          value={stat}
          onValueChange={(value: "browser" | "deviceType" | "os") => setStat(value)}
        >
          <SelectTrigger className="-ml-1.5 h-8 w-auto space-x-3 border-none px-2 shadow-none hover:bg-accent dark:hover:bg-accent/60">
            <p className="text-sm font-medium">
              {stat === "browser"
                ? "Browsers"
                : stat === "deviceType"
                  ? "Devices"
                  : "Operating Systems"}
            </p>
          </SelectTrigger>
          <SelectContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              <SelectItem value="browser">Browsers</SelectItem>
              <SelectItem value="deviceType">Devices</SelectItem>
              <SelectItem value="os">Operating systems</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {stat === "browser" && <Compass size={15} className="text-muted-foreground" />}
        {stat === "deviceType" && <MonitorSmartphone size={15} className="text-muted-foreground" />}
        {stat === "os" && <Box size={15} className="text-muted-foreground" />}
      </div>
      {isLoading ? (
        <div className="flex h-[245px] items-center justify-center p-4">
          <Loader />
        </div>
      ) : events.length ? (
        <ScrollArea className="h-[245px]">
          <div className="py-3">
            {stat === "browser" && browsers.length 
              ? browsers.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    url={item.url}
                    showIcon={false}
                    type="percent"
                    actualPercent={item.percent}
                    percent={
                      i === 0 ? 100 : item.percent === browsers[0].percent ? 100 : item.percent
                    }
                    selected={browser === item.label}
                    onClick={() => {
                      // filter events by referrerDomain
                      if (browser === item.label) {
                        setBrowser(undefined);
                      } else {
                        setBrowser(item.label);
                      }
                    }}
                  />
                ))
              : stat === "deviceType" && deviceTypes.length
                ? deviceTypes.map((item, i) => (
                    <ProgressNumTab
                      key={item.label}
                      label={item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                      count={item.count}
                      type="percent"
                      actualPercent={item.percent}
                      percent={
                        i === 0 ? 100 : item.percent === deviceTypes[0].percent ? 100 : item.percent
                      }
                      url={item.url}
                      showIcon={false}
                      selected={deviceType === item.label}
                      onClick={() => {
                        if (deviceType === item.label) {
                          setDeviceType(undefined);
                        } else {
                          setDeviceType(item.label);
                        }
                      }}
                    />
                  ))
                : stat === "os" && oss.length
                  ? oss.map((item, i) => (
                      <ProgressNumTab
                        key={item.label}
                      label={item.label}
                      count={item.count}
                      percent={i === 0 ? 100 : item.percent === oss[0].percent ? 100 : item.percent}
                      type="percent"
                      actualPercent={item.percent}
                      url={item.url}
                      showIcon={false}
                      selected={os === item.label}
                      onClick={() => {
                        if (os === item.label) {
                          setOs(undefined);
                        } else {
                          setOs(item.label);
                        }
                      }}
                    />
                  ))
                : (
                    <div className="flex h-[245px] items-center justify-center p-4">
                      <div className="text-sm text-muted-foreground">No data available</div>
                    </div>
                  )}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex h-[245px] items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
};
