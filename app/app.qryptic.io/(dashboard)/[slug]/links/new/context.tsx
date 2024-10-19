"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { type Domain, Tag, LogoType, Tab, Country } from "@/types/links";

type LinkForm = {
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
  imageFile: File | null;
  setImageFile: (imageFile: File | null) => void;
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
};

const LinkFormContext = createContext<LinkForm | undefined>(undefined);

export const LinkFormProvider = ({ children }: { children: ReactNode }) => {
  // Tab state
  const [tab, setTab] = useState<Tab>("general");

  // General form values
  const [destination, setDestination] = useState<string>("");
  const [domain, setDomain] = useState<Domain | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<string>("");

  // QR form values
  // const [qrImageURL, setQrImageURL] = useState<string | null>(null);
  // const [generations, setGenerations] = useState<{ img: string; prompt: string }[]>([]);
  const [qrCodeType, setQrCodeType] = useState<"standard" | "ai" | null>("standard");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoType, setLogoType] = useState<LogoType>(null);
  const [color, setColor] = useState<string>("#000000");
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  // const [prompt, setPrompt] = useState<string>("");

  // utm form values
  const [utmSource, setUtmSource] = useState<string>("");
  const [utmMedium, setUtmMedium] = useState<string>("");
  const [utmCampaign, setUtmCampaign] = useState<string>("");
  const [utmTerm, setUtmTerm] = useState<string>("");
  const [utmContent, setUtmContent] = useState<string>("");

  // device targeting form values
  const [ios, setIos] = useState<string>("");
  const [android, setAndroid] = useState<string>("");

  // geo targeting
  const [geo, setGeo] = useState<Record<string, Country>>({});

  // expiration form values
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [expiredDestination, setExpiredDestination] = useState<string>("");

  // Open Graph form values
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ogUrl, setOgUrl] = useState<string>("");

  // protection
  const [password, setPassword] = useState<string>("");

  // cloaking
  const [shouldCloak, setShouldCloak] = useState<boolean>(false);

  // indexing
  const [shouldIndex, setShouldIndex] = useState<boolean>(false);

  return (
    <LinkFormContext.Provider
      value={{
        tab,
        setTab,
        destination,
        setDestination,
        domain,
        setDomain,
        tags,
        setTags,
        slug,
        setSlug,
        notes,
        setNotes,
        title,
        setTitle,
        description,
        setDescription,
        image,
        setImage,
        ogUrl,
        setOgUrl,
        qrCodeType,
        setQrCodeType,
        logo,
        setLogo,
        logoType,
        setLogoType,
        color,
        setColor,
        logoDimensions,
        setLogoDimensions,
        // qrImageURL,
        // setQrImageURL,
        // prompt,
        // setPrompt,
        // generations,
        // setGenerations,
        utmSource,
        setUtmSource,
        utmMedium,
        setUtmMedium,
        utmCampaign,
        setUtmCampaign,
        utmTerm,
        setUtmTerm,
        utmContent,
        setUtmContent,
        ios,
        setIos,
        android,
        setAndroid,
        geo,
        setGeo,
        expiresAt,
        setExpiresAt,
        expiredDestination,
        setExpiredDestination,
        imageFile,
        setImageFile,
        password,
        setPassword,
        shouldCloak,
        setShouldCloak,
      }}
    >
      {children}
    </LinkFormContext.Provider>
  );
};

export const useLinkForm = (): LinkForm => {
  const context = useContext(LinkFormContext);
  if (context === undefined) {
    throw new Error("useLinkForm must be used within a LinkFormProvider");
  }
  return context;
};
