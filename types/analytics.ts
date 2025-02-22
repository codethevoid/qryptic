export type TimeFrame =
  | "today"
  // | "twentyFourHours"
  | "sevenDays"
  | "fourWeeks"
  | "threeMonths"
  | "twelveMonths"
  | "threeYears"
  | "fiveYears"
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
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};
