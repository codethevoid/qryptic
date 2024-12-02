"use client";

import { type TimeFrame } from "@/types/analytics";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays, startOfToday, subHours } from "date-fns";
import { TimeframePicker } from "@/app/app.qryptic.io/(dashboard)/[slug]/analytics/timeframe-picker";
import { DatePicker } from "@/app/app.qryptic.io/(dashboard)/[slug]/analytics/date-picker";
import { useAnalytics } from "@/lib/hooks/swr/use-analytics";
import { AnalyticsChart } from "@/components/charts/analytics-chart";
import { LinksData } from "@/app/app.qryptic.io/(dashboard)/[slug]/analytics/data-cards/links";
import { ReferrerData } from "@/app/app.qryptic.io/(dashboard)/[slug]/analytics/data-cards/referrers";
import { LocationData } from "@/app/app.qryptic.io/(dashboard)/[slug]/analytics/data-cards/location";
import { UserAgentData } from "@/app/app.qryptic.io/(dashboard)/[slug]/analytics/data-cards/user-agent";
import { OsData } from "./data-cards/os";

export const AnalyticsClient = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("today");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subHours(startOfToday(), 23),
    to: startOfToday(),
  });
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);

  // filters
  const [shortUrl, setShortUrl] = useState<string | undefined>(undefined);
  const [destination, setDestination] = useState<string | undefined>(undefined);
  const [referrer, setReferrer] = useState<string | undefined>(undefined);
  const [referrerDomain, setReferrerDomain] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [browser, setBrowser] = useState<string | undefined>(undefined);
  const [os, setOs] = useState<string | undefined>(undefined);
  const [deviceType, setDeviceType] = useState<string | undefined>(undefined);
  const [utmSource, setUtmSource] = useState<string>("");
  const [utmMedium, setUtmMedium] = useState<string>("");
  const [utmCampaign, setUtmCampaign] = useState<string>("");
  const [utmTerm, setUtmTerm] = useState<string>("");
  const [utmContent, setUtmContent] = useState<string>("");

  const { data, isLoading, error } = useAnalytics({
    from: date?.from as Date,
    to: date?.to as Date,
    shortUrl,
    destination,
    referrer,
    referrerDomain,
    country,
    city,
    browser,
    os,
    deviceType,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Analytics</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <div className="flex">
            <TimeframePicker
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              setDate={setDate}
              setTempDate={setTempDate}
            />
            <DatePicker
              date={date}
              setDate={setDate}
              tempDate={tempDate}
              setTempDate={setTempDate}
              setTimeFrame={setTimeFrame}
              timeFrame={timeFrame}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4 max-[768px]:mt-3">
        <AnalyticsChart events={data} date={date} isLoading={isLoading} />
        <div className="grid grid-cols-2 gap-4 max-[800px]:grid-cols-1">
          <LinksData
            events={data}
            isLoading={isLoading}
            shortUrl={shortUrl}
            setShortUrl={setShortUrl}
            destination={destination}
            setDestination={setDestination}
          />
          <ReferrerData
            events={data}
            isLoading={isLoading}
            referrer={referrer}
            setReferrer={setReferrer}
            referrerDomain={referrerDomain}
            setReferrerDomain={setReferrerDomain}
            utmSource={utmSource}
            setUtmSource={setUtmSource}
            utmMedium={utmMedium}
            setUtmMedium={setUtmMedium}
            utmCampaign={utmCampaign}
            setUtmCampaign={setUtmCampaign}
            utmTerm={utmTerm}
            setUtmTerm={setUtmTerm}
            utmContent={utmContent}
            setUtmContent={setUtmContent}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">
          <LocationData
            events={data}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            isLoading={isLoading}
          />
          <UserAgentData
            events={data}
            isLoading={isLoading}
            browser={browser}
            setBrowser={setBrowser}
            deviceType={deviceType}
            setDeviceType={setDeviceType}
          />
          <OsData events={data} isLoading={isLoading} os={os} setOs={setOs} />
        </div>
      </div>
    </>
  );
};
