export type TimeFrame =
  | "today"
  | "twentyFourHours"
  | "sevenDays"
  | "fourWeeks"
  | "threeMonths"
  | "twelveMonths"
  | "threeYears"
  | "monthToDate"
  | "yearToDate"
  | "all"
  | "custom";

export type Event = {
  id: string;
  createdAt: Date;
  slug: string;
  domainName: string;
  shortUrl: string;
  destination: string;
  type: "click" | "scan";
  continent: string;
  country: string;
  city: string;
  browser: string;
  deviceType: string;
  os: string;
  referrer: string;
  referrerDomain: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
};
