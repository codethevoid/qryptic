import type { Event } from "@/types/analytics";

type Key =
  | "shortUrl"
  | "destination"
  | "referrer"
  | "referrerDomain"
  | "country"
  | "city"
  | "browser"
  | "os"
  | "deviceType";

export const groupBy = (events: Event[], key: Key) => {
  if (!events?.length) return [];

  const grouped: Record<
    string,
    {
      label: string;
      count: number;
      percent: number;
      url: string;
      country: string;
      formattedKey: string;
    }
  > = {};

  events.forEach((event) => {
    // if key is city, we can get duplicate cities with different countries
    // so we need to group by city and country
    let formattedKey = key === "city" ? `${event[key]}-${event.country}` : event[key];
    if (key === "city" && formattedKey.includes("unknown")) {
      formattedKey = "unknown"; // group all unknown cities together regardless of country
    }

    // set percentage of count to total events
    if (!grouped[formattedKey]) {
      grouped[formattedKey] = {
        label: event[key],
        count: 1,
        percent: 0,
        url: key === "shortUrl" || key === "destination" ? event.destination : event[key],
        country: event.country,
        formattedKey,
      };
    } else {
      grouped[formattedKey].count++;
    }
    const percent = (grouped[formattedKey].count / events.length) * 100;
    grouped[formattedKey] = { ...grouped[formattedKey], percent };
  });

  return Object.values(grouped).sort((a, b) => b.count - a.count);
};
