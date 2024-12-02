import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { type Event } from "@/types/analytics";

type Params = {
  from: Date;
  to: Date;
  shortUrl?: string;
  destination?: string;
  referrer?: string;
  referrerDomain?: string;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export const useAnalytics = ({
  from,
  to,
  shortUrl = "",
  destination = "",
  referrer = "",
  referrerDomain = "",
  country = "",
  city = "",
  browser = "",
  os = "",
  deviceType = "",
  utmSource = "",
  utmMedium = "",
  utmCampaign = "",
  utmTerm = "",
  utmContent = "",
}: Params) => {
  const { slug } = useParams();

  const searchParams = new URLSearchParams();
  searchParams.append("from", from.toISOString());
  searchParams.append("to", to.toISOString());
  searchParams.append("shortUrl", shortUrl);
  searchParams.append("destination", destination);
  searchParams.append("referrer", referrer);
  searchParams.append("referrerDomain", referrerDomain);
  searchParams.append("country", country);
  searchParams.append("city", city.split("-")[0]);
  searchParams.append("browser", browser);
  searchParams.append("os", os);
  searchParams.append("deviceType", deviceType);
  searchParams.append("utmSource", utmSource);
  searchParams.append("utmMedium", utmMedium);
  searchParams.append("utmCampaign", utmCampaign);
  searchParams.append("utmTerm", utmTerm);
  searchParams.append("utmContent", utmContent);

  const { data, isLoading, error } = useSWR<Event[]>(
    `/api/analytics/${slug}?${searchParams}`,
    fetcher,
  );

  return { data, isLoading, error };
};
