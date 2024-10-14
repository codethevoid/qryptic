"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { Tab } from "@/types/links";
import { type Domain, Tag } from "@/types/links";
import { type LogoType } from "@/types/links";

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
  qrImageURL: string | null;
  setQrImageURL: (qrImageURL: string | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
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
  const [qrImageURL, setQrImageURL] = useState<string | null>(null);
  const [qrCodeType, setQrCodeType] = useState<"standard" | "ai" | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoType, setLogoType] = useState<LogoType>(null);
  const [color, setColor] = useState<string>("#000000");
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [prompt, setPrompt] = useState<string>("");

  // Open Graph form values
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [ogUrl, setOgUrl] = useState<string>("");

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
        qrImageURL,
        setQrImageURL,
        prompt,
        setPrompt,
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
