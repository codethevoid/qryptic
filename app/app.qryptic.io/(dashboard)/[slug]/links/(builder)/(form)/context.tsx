"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { type Domain, Tag, LogoType, Tab, Country, LinkForm } from "@/types/links";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LinkFormContext = createContext<LinkForm | undefined>(undefined);

export const LinkFormProvider = ({ children }: { children: ReactNode }) => {
  const { slug: teamSlug, id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [existingLink, setExistingLink] = useState<any | null>(null);
  // Tab state
  const [tab, setTab] = useState<Tab>("general");

  // General (form) values
  const [destination, setDestination] = useState<string>("");
  const [domain, setDomain] = useState<Domain | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<string>("");

  // QR (form) values
  // const [qrImageURL, setQrImageURL] = useState<string | null>(null);
  // const [generations, setGenerations] = useState<{ img: string; prompt: string }[]>([]);
  const [qrCodeType, setQrCodeType] = useState<"standard" | "ai" | null>("standard");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoType, setLogoType] = useState<LogoType>(null);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoFileType, setLogoFileType] = useState<string | null>(null);
  const [color, setColor] = useState<string>("#000000");
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  // const [prompt, setPrompt] = useState<string>("");

  // utm (form) values
  const [utmSource, setUtmSource] = useState<string>("");
  const [utmMedium, setUtmMedium] = useState<string>("");
  const [utmCampaign, setUtmCampaign] = useState<string>("");
  const [utmTerm, setUtmTerm] = useState<string>("");
  const [utmContent, setUtmContent] = useState<string>("");

  // device targeting (form) values
  const [ios, setIos] = useState<string>("");
  const [android, setAndroid] = useState<string>("");

  // geo targeting
  const [geo, setGeo] = useState<Record<string, Country>>({});

  // expiration (form) values
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [expiredDestination, setExpiredDestination] = useState<string>("");

  // Open Graph (form) values
  const [initialOgData, setInitialOgData] = useState<{
    title: string;
    description: string;
    image: string;
  }>({
    title: "",
    description: "",
    image: "",
  });
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>("");
  const [ogUrl, setOgUrl] = useState<string>("");

  // protection
  const [password, setPassword] = useState<string>("");
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [shouldDisablePassword, setShouldDisablePassword] = useState<boolean>(false);

  // cloaking
  const [shouldCloak, setShouldCloak] = useState<boolean>(false);

  // indexing
  const [shouldIndex, setShouldIndex] = useState<boolean>(false);

  const shouldProxy = () => {
    // If all fields are empty, don't proxy
    if (!title && !description && !image) return false;

    // Check if any of the fields have changed, including if they've been cleared
    const titleChanged = initialOgData.title !== (title || "");
    const descriptionChanged = initialOgData.description !== (description || "");
    const imageChanged = initialOgData.image !== (image || "");

    // If any of the fields have changed, we should proxy the link
    return titleChanged || descriptionChanged || imageChanged;
  };

  const submitForm = async (): Promise<any> => {
    if (!destination) return toast.error("Destination is required");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/links/${teamSlug}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          domain,
          slug,
          tags,
          notes,
          qrCodeType,
          logo,
          logoType,
          logoFile,
          logoFileType,
          color,
          logoDimensions,
          ios,
          android,
          geo,
          expiresAt,
          expiredDestination,
          title,
          description,
          image,
          imageFile,
          imageType,
          password,
          shouldCloak,
          shouldIndex,
          shouldProxy: shouldProxy(),
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
        }),
      });

      setIsSubmitting(false);
      if (!res.ok) {
        const { error } = await res.json();
        return toast.error(error);
      }

      // push to the new link
      router.push(`/${teamSlug}/links`);
      toast.success("Link created successfully");
    } catch (e) {
      console.error(e);
      toast.error("An error occured");
    }
  };

  const editForm = async (): Promise<any> => {
    if (!destination) return toast.error("Destination is required");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/links/${teamSlug}/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          domain,
          slug,
          tags,
          notes,
          qrCodeType,
          logo,
          logoType,
          logoFile,
          logoFileType,
          color,
          logoDimensions,
          ios,
          android,
          geo,
          expiresAt,
          expiredDestination,
          title,
          description,
          image,
          imageFile,
          imageType,
          password,
          shouldCloak,
          shouldIndex,
          shouldProxy: shouldProxy(),
          shouldDisablePassword,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
        }),
      });

      if (!res.ok) {
        setIsSubmitting(false);
        const { error } = await res.json();
        toast.error(error);
        return false;
      }

      // mutate the link to update the link details
      setPassword("");
      setShouldDisablePassword(false);
      setIsSubmitting(false);
      toast.success("Link updated successfully");
      return true;
    } catch (e) {
      console.error(e);
      toast.error("An error occured");
      return false;
    }
  };

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
        shouldIndex,
        setShouldIndex,
        imageType,
        setImageType,
        logoFile,
        setLogoFile,
        logoFileType,
        setLogoFileType,
        submitForm,
        editForm,
        isSubmitting,
        setIsSubmitting,
        existingLink,
        setExistingLink,
        isPasswordProtected,
        setIsPasswordProtected,
        shouldDisablePassword,
        setShouldDisablePassword,
        initialOgData,
        setInitialOgData,
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
