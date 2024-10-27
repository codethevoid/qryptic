import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { type Event } from "@/types/analytics";
import { Map } from "lucide-react";
import { groupBy } from "@/lib/formatters/group-by";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressNumTab } from "@/components/charts/progress-num-tab";
import { Loader } from "@/components/layout/loader";
import { countries as countriesList } from "@/utils/countries/countries";

type Props = {
  events: Event[] | undefined;
  isLoading: boolean;
  country: string | undefined;
  setCountry: (value: string | undefined) => void;
  city: string | undefined;
  setCity: (value: string | undefined) => void;
};

export const LocationData = ({
  events = [],
  isLoading,
  country,
  setCountry,
  city,
  setCity,
}: Props) => {
  const [stat, setStat] = useState<"country" | "city">("country");
  const countries = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "country");
  }, [events]);
  const cities = useMemo(() => {
    if (!events?.length) return [];
    return groupBy(events, "city");
  }, [events]);

  console.log(country, city);

  return (
    <div className="overflow-hidden rounded-lg border shadow">
      <div className="flex items-center justify-between border-b bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
        <Select value={stat} onValueChange={(value: "country" | "city") => setStat(value)}>
          <SelectTrigger className="-ml-1.5 h-8 w-auto space-x-3 border-none px-2 shadow-none hover:bg-accent dark:hover:bg-accent/60">
            <p className="text-sm font-medium">{stat === "country" ? "Countries" : "Cities"}</p>
          </SelectTrigger>
          <SelectContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
            <SelectGroup>
              <SelectItem value="country">Countries</SelectItem>
              <SelectItem value="city">Cities</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Map className="text-muted-foreground" size={15} />
      </div>
      {isLoading ? (
        <div className="flex h-[245px] items-center justify-center p-4">
          <Loader />
        </div>
      ) : events.length ? (
        <ScrollArea className="h-[245px]">
          <div className="py-3">
            {stat === "country"
              ? countries.map((item, i) => (
                  <ProgressNumTab
                    key={item.label}
                    label={countriesList.find((c) => c.code === item.label)?.country || item.label}
                    count={item.count}
                    flag={`https://flagcdn.com/40x30/${item.label.toLowerCase()}.png`}
                    icon={<Map size={16} />}
                    selected={country === item.label}
                    alt={`flag of ${item.label}`}
                    type="percent"
                    actualPercent={item.percent}
                    onlyIcon={item.label === "unknown"}
                    percent={
                      i === 0 ? 100 : item.percent === countries[0].percent ? 100 : item.percent
                    }
                    onClick={() => {
                      // filter events by country
                      if (country === item.label) {
                        setCountry(undefined);
                        setCity(undefined);
                      } else {
                        setCountry(item.label);
                        // reset city filter when country is selected
                        // bc duplicate cities with different countries
                        setCity(undefined);
                      }
                    }}
                  />
                ))
              : cities.map((item, i) => (
                  <ProgressNumTab
                    key={item.formattedKey}
                    label={item.label}
                    count={item.count}
                    percent={
                      i === 0 ? 100 : item.percent === cities[0].percent ? 100 : item.percent
                    }
                    actualPercent={item.percent}
                    flag={`https://flagcdn.com/40x30/${countriesList.find((c) => c.code === item.country)?.code.toLowerCase() || ""}.png`}
                    alt={`flag of ${item.country}`}
                    icon={<Map size={16} />}
                    selected={city === item.formattedKey}
                    onlyIcon={item.country === "unknown"}
                    type="percent"
                    onClick={() => {
                      // filter events by destination
                      if (city === item.formattedKey) {
                        setCity(undefined);
                        setCountry(undefined);
                      } else {
                        setCity(item.formattedKey);
                        setCountry(item.formattedKey.split("-")[1]);
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
