import { TagColor } from "@/types/colors";

export type TableLink = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  createdAt: Date;
  isArchived: boolean;
  user: { name: string; email: string; image: string };
  domain: { name: string };
  events: { type: "click" | "scan" }[];
  tags: { id: string; name: string; color: TagColor }[];
  _count: { events: number; tags: number };
  qrCode: {
    color: string;
    logo: string;
    logoHeight: number;
    logoWidth: number;
  };
};

export type LinksTable = {
  links: TableLink[];
  domains: { id: string; name: string }[];
  tags: {
    id: string;
    name: string;
    color: TagColor;
  }[];
  totals: {
    active: number;
    archived: number;
    all: number;
    filtered: number;
  };
};

export type Tab =
  | "general"
  | "device"
  | "utm"
  | "geo"
  | "cloaking"
  | "protection"
  | "qr"
  | "expiration"
  | "preview"
  | "indexing";

export type Opengraph = {
  title: string | "";
  description: string | "";
  image: string | "";
  url: string | "";
  noUrlToFetch?: boolean;
};

export type Domain = {
  id: string;
  name: string;
  isPrimary: boolean;
  destination: string;
};

export type Tag = {
  id: string;
  name: string;
  color: TagColor;
};

export type LogoType = "custom" | "team" | "qryptic" | null;

export type Country = { country: string; code: string; destination: string };

export type LinkForm = {
  tab: Tab;
  setTab: (tab: Tab) => void;
  destination: string;
  setDestination: (destination: string) => void;
  domain: Domain | null;
  setDomain: (domain: Domain) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  slug: string;
  setSlug: (slug: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  image: string;
  setImage: (image: string) => void;
  imageFile: string | null;
  setImageFile: (imageFile: string | null) => void;
  ogUrl: string;
  setOgUrl: (ogUrl: string) => void;
  qrCodeType: "standard" | "ai" | null;
  setQrCodeType: (qrCodeType: "standard" | "ai" | null) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  logoType: LogoType;
  setLogoType: (logoType: LogoType) => void;
  color: string;
  setColor: (color: string) => void;
  logoDimensions: { width: number; height: number };
  setLogoDimensions: (logoDimensions: { width: number; height: number }) => void;
  // qrImageURL: string | null;
  // setQrImageURL: (qrImageURL: string | null) => void;
  // prompt: string;
  // setPrompt: (prompt: string) => void;
  // generations: { img: string; prompt: string }[];
  // setGenerations: (generations: { img: string; prompt: string }[]) => void;
  utmSource: string;
  setUtmSource: (utmSource: string) => void;
  utmMedium: string;
  setUtmMedium: (utmMedium: string) => void;
  utmCampaign: string;
  setUtmCampaign: (utmCampaign: string) => void;
  utmTerm: string;
  setUtmTerm: (utmTerm: string) => void;
  utmContent: string;
  setUtmContent: (utmContent: string) => void;
  ios: string;
  setIos: (ios: string) => void;
  android: string;
  setAndroid: (android: string) => void;
  geo: Record<string, Country>;
  setGeo: (geo: Record<string, Country>) => void;
  expiresAt: Date | undefined;
  setExpiresAt: (expires: Date | undefined) => void;
  expiredDestination: string;
  setExpiredDestination: (expiredDestination: string) => void;
  password: string;
  setPassword: (password: string) => void;
  shouldCloak: boolean;
  setShouldCloak: (shouldCloak: boolean) => void;
  shouldIndex: boolean;
  setShouldIndex: (shouldIndex: boolean) => void;
  imageType: string | null;
  setImageType: (imageType: string | null) => void;
  logoFile: string | null;
  setLogoFile: (logoFile: string | null) => void;
  logoFileType: string | null;
  setLogoFileType: (logoFileType: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  submitForm: () => Promise<any>;
  editForm: () => Promise<any>;
  existingLink: any | null;
  setExistingLink: (existingLink: any | null) => void;
  isPasswordProtected: boolean;
  setIsPasswordProtected: (isPasswordProtected: boolean) => void;
  shouldDisablePassword: boolean;
  setShouldDisablePassword: (shouldDisablePassword: boolean) => void;
  initialOgData: { title: string; description: string; image: string };
  setInitialOgData: (initialOgData: { title: string; description: string; image: string }) => void;
};

export type CreateLinkBody = {
  destination: string;
  domain: Domain;
  slug: string;
  tags: Tag[];
  notes: string;
  qrCodeType: "standard";
  logo: string | null;
  logoType: LogoType;
  logoFile: string | null;
  logoFileType: "image/png" | "image/jpeg" | "image/jpg" | null;
  color: string;
  logoDimensions: { width: number; height: number };
  ios: string;
  android: string;
  geo: Record<string, { country: string; code: string; destination: string }>;
  expiresAt: Date | undefined;
  expiredDestination: string;
  title: string;
  description: string;
  image: string | null;
  imageFile: string | null;
  imageType: "image/png" | "image/jpeg" | "image/jpg" | null;
  shouldCloak: boolean;
  shouldIndex: boolean;
  password: string;
  shouldProxy: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

export type EditLinkBody = {
  destination: string;
  domain: Domain;
  slug: string;
  tags: Tag[];
  notes: string;
  qrCodeType: "standard";
  logo: string | null;
  logoType: LogoType;
  logoFile: string | null;
  logoFileType: "image/png" | "image/jpeg" | "image/jpg" | null;
  color: string;
  logoDimensions: { width: number; height: number };
  ios: string;
  android: string;
  geo: Record<string, { country: string; code: string; destination: string }>;
  expiresAt: Date | undefined;
  expiredDestination: string;
  title: string;
  description: string;
  image: string | null;
  imageFile: string | null;
  imageType: "image/png" | "image/jpeg" | "image/jpg" | null;
  shouldCloak: boolean;
  shouldIndex: boolean;
  password: string;
  shouldDisablePassword: boolean;
  shouldProxy: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

export type MiddlewareLink = {
  id: string;
  teamId: string;
  destination: string;
  passwordHash: string | null;
  expiresAt: Date | null;
  shouldCloak: boolean;
  shouldIndex: boolean;
  shouldProxy: boolean;
  isBanned: boolean;
  ios: string | null;
  android: string | null;
  expired: string | null;
  geo: Record<string, { country: string; code: string; destination: string }> | null;
  domain: { id: string; destination: string };
  isPasswordProtected: boolean;
};

// use link

export type Link = {
  id: string;
  destination: string;
  slug: string;
  notes: string;
  ios: string;
  android: string;
  geo: Record<string, { country: string; code: string; destination: string }>;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  expiresAt: Date | undefined;
  expired: string;
  shouldCloak: boolean;
  shouldIndex: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  passwordHash: string;
  domain: { id: string; name: string; isPrimary: boolean; destination: string };
  tags: { id: string; name: string; color: TagColor }[];
  qrCode: {
    type: "standard" | "ai" | null;
    logo: string;
    logoType: LogoType;
    color: string;
    logoWidth: number;
    logoHeight: number;
  };
};
