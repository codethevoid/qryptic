import { Select, SelectTrigger } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { type Event } from "@/types/analytics";
import { Box, Compass, Globe, Link2, MonitorSmartphone } from "lucide-react";
import { groupBy } from "@/lib/formatters/group-by";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressNumTab } from "@/components/charts/progress-num-tab";
import { Loader } from "@/components/layout/loader";

type Props = {
  events: Event[] | undefined;
  isLoading: boolean;
  os: string | undefined;
  setOs: (value: string | undefined) => void;
};

export const OsData = ({ events = [], isLoading, os, setOs }: Props) => {
  const stat = "os";
  const oss = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "os");
  }, [events]);

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div className="flex items-center justify-between border-b bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
        {/* <Select> */}
        <div className="-ml-1.5 flex h-8 w-auto items-center space-x-3 border-none px-2 shadow-none">
          <p className="text-sm font-medium">Operating systems</p>
        </div>
        {/* </Select> */}
        {stat === "os" && <Box size={15} className="text-muted-foreground" />}
      </div>
      {isLoading ? (
        <div className="flex h-[245px] items-center justify-center p-4">
          <Loader />
        </div>
      ) : events.length ? (
        <ScrollArea className="h-[245px]">
          <div className="py-3">
            {stat === "os" && oss.length ? (
              oss.map((item, i) => (
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
            ) : (
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
