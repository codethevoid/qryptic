type Device = "console" | "mobile" | "tablet" | "smarttv" | "wearable" | "embedded";

type BrowserEngine =
  | "Amaya"
  | "Blink"
  | "EdgeHTML"
  | "Flow"
  | "Gecko"
  | "Goanna"
  | "iCab"
  | "KHTML"
  | "Links"
  | "Lynx"
  | "NetFront"
  | "NetSurf"
  | "Presto"
  | "Tasman"
  | "Trident"
  | "w3m"
  | "WebKit";

type CPU =
  | "68k"
  | "amd64"
  | "arm"
  | "arm64"
  | "armhf"
  | "avr"
  | "ia32"
  | "ia64"
  | "irix"
  | "irix64"
  | "mips"
  | "mips64"
  | "pa-risc"
  | "ppc"
  | "sparc"
  | "sparc64";

export type UserAgent = {
  isBot: boolean;
  ua: string;
  browser: { name?: string; version?: string };
  device: { model?: string; type?: Device; vendor?: string };
  engine: { name?: BrowserEngine; version?: string };
  os: { name?: string; version?: string };
  cpu: { architecture?: CPU };
};

export type Continent = "AF" | "AN" | "AS" | "EU" | "NA" | "OC" | "SA";

export type Geo = {
  city: string;
  country: string;
  flag: string;
  countryRegion: string;
  region: string;
  latitude: string;
  longitude: string;
};
