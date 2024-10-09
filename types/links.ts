import { TagColor } from "@/types/colors";

export type TableLink = {
  id: string;
  name: string;
  slug: string;
  destination: string;
  createdAt: Date;
  createdBy: { user: { image: string; name: string | null; email: string } };
  domain: { name: string };
  events: { type: "click" | "scan" }[];
  tags: { id: string; name: string; color: TagColor }[];
  _count: { events: number; tags: number };
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
  | "cards"
  | "indexing";

export type Opengraph = {
  title: string | "";
  description: string | "";
  image: string | "";
  url: string | "";
};

export type Domain = {
  id: string;
  name: string;
  isPrimary: boolean;
};

export type Tag = {
  id: string;
  name: string;
  color: TagColor;
};
