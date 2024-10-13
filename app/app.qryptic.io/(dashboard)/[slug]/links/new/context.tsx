"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { Tab } from "@/types/links";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useOpenGraph } from "@/lib/hooks/swr/use-open-graph";
import { type Domain, Tag } from "@/types/links";

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
  const [qrCodeType, setQrCodeType] = useState<"standard" | "ai" | null>(null);

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
