import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { type Event } from "@/types/analytics";
import { Link2 } from "lucide-react";
import { groupBy } from "@/lib/formatters/group-by";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressNumTab } from "@/components/charts/progress-num-tab";
import { Loader } from "@/components/layout/loader";

const stripDestination = (destination: string) => {
  // remove https://, http://, and www. from destination
  // and remove search params
  return destination
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .split("?")[0];
};

type Props = {
  events: Event[] | undefined;
  isLoading: boolean;
  setShortUrl: (value: string | undefined) => void;
  setDestination: (value: string | undefined) => void;
  shortUrl: string | undefined;
  destination: string | undefined;
};

export const LinksData = ({
  events = [],
  isLoading,
  setShortUrl,
  setDestination,
  shortUrl,
  destination,
}: Props) => {
  const [stat, setStat] = useState<"shortUrl" | "destination">("shortUrl");
  const shortUrls = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "shortUrl");
  }, [events]);
  const destinations = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "destination");
  }, [events]);

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div className="flex items-center justify-between border-b bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
        <Select value={stat} onValueChange={(value: "shortUrl" | "destination") => setStat(value)}>
          <SelectTrigger className="-ml-1.5 h-8 w-auto space-x-3 border-none px-2 shadow-none hover:bg-accent dark:hover:bg-accent/60">
            <p className="text-sm font-medium">
              {stat === "shortUrl" ? "Short links" : "Destinations"}
            </p>
          </SelectTrigger>
          <SelectContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              <SelectItem value="shortUrl">Short links</SelectItem>
              <SelectItem value="destination">Destinations</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Link2 className="text-muted-foreground" size={15} />
      </div>
      {isLoading ? (
        <div className="flex h-[245px] items-center justify-center p-4">
          <Loader />
        </div>
      ) : events.length ? (
        <ScrollArea className="h-[245px]">
          <div className="py-3">
            {stat === "shortUrl"
              ? shortUrls.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    url={item.url}
                    icon={<Link2 size={16} className="text-muted-foreground" />}
                    selected={shortUrl === item.label}
                    percent={
                      i === 0 ? 100 : item.percent === shortUrls[0].percent ? 100 : item.percent
                    }
                    onClick={() => {
                      // filter events by shortUrl
                      if (shortUrl === item.label) {
                        setShortUrl(undefined);
                      } else {
                        setShortUrl(item.label);
                      }
                    }}
                  />
                ))
              : destinations.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={stripDestination(item.label)}
                    count={item.count}
                    percent={
                      i === 0 ? 100 : item.percent === destinations[0].percent ? 100 : item.percent
                    }
                    url={item.url}
                    icon={<Link2 size={16} className="text-muted-foreground" />}
                    selected={destination === item.label}
                    onClick={() => {
                      // filter events by destination
                      if (destination === item.label) {
                        setDestination(undefined);
                      } else {
                        setDestination(item.label);
                      }
                    }}
                  />
                ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex h-[245px] items-center justify-center p-4">
          <div className="text-sm text-muted-foreground">No data available</div>
        </div>
      )}
    </div>
  );
};
