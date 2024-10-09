"use client";

import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { Tab } from "@/types/links";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useOpenGraph } from "@/lib/hooks/swr/use-open-graph";

type LinkForm = {
  tab: Tab;
  setTab: (tab: Tab) => void;
  destination: string;
  debouncedDestination: string;
  setDestination: (destination: string) => void;
  domain: string;
  setDomain: (domain: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  image: string;
  setImage: (image: string) => void;
  ogUrl: string;
  isLoadingOpengraph: boolean;
  opengraphError: any;
};

const LinkFormContext = createContext<LinkForm | undefined>(undefined);

const LinkFormProvider = ({ children }: { children: ReactNode }) => {
  // Tab state
  const [tab, setTab] = useState<Tab>("general");

  // General form values
  const [destination, setDestination] = useState<string>("");
  const debouncedDestination = useDebounce(destination, 500);
  const [domain, setDomain] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  // QR form values

  // Open Graph form values
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [ogUrl, setOgUrl] = useState<string>("");
  const { data, isLoading, error } = useOpenGraph(debouncedDestination);
  console.log(data);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setImage(data.image);
      setOgUrl(data.url);
    }
  }, [data]);

  return (
    <LinkFormContext.Provider
      value={{
        tab,
        setTab,
        destination,
        debouncedDestination,
        setDestination,
        domain,
        setDomain,
        slug,
        setSlug,
        title,
        setTitle,
        description,
        setDescription,
        image,
        setImage,
        ogUrl,
        isLoadingOpengraph: isLoading,
        opengraphError: error,
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

export { LinkFormProvider };
