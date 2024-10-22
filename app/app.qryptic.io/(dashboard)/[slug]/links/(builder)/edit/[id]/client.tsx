"use client";

import { NewLinkNav } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/nav";
import { LinkPreview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/preview";
import { LinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/form";
import {
  LinkFormProvider,
  useLinkForm,
} from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { useLink } from "@/lib/hooks/swr/use-link";
import { useEffect } from "react";
import { EditLinkSnackbar } from "@/components/snackbar/edit-link-snackbar";

export const EditLinkProviderClient = () => {
  return (
    <LinkFormProvider>
      <EditLinkClient />
    </LinkFormProvider>
  );
};

const EditLinkClient = () => {
  const { data, isLoading, error, mutate } = useLink();
  const {
    setDestination,
    setDomain,
    setSlug,
    setTags,
    setNotes,
    setQrCodeType,
    setLogo,
    setLogoType,
    setColor,
    setLogoDimensions,
    setExistingLink,
    setUtmSource,
    setUtmMedium,
    setUtmCampaign,
    setUtmTerm,
    setUtmContent,
    setIos,
    setAndroid,
    setGeo,
    setTitle,
    setDescription,
    setImage,
    setExpiresAt,
    setExpiredDestination,
    setShouldCloak,
    setShouldIndex,
    setIsPasswordProtected,
  } = useLinkForm();

  const setSearchParams = () => {
    // get utm values
    const searchParams = new URLSearchParams(data.link.destination?.split("?")[1]);
    setUtmSource(searchParams.get("utm_source") || "");
    setUtmMedium(searchParams.get("utm_medium") || "");
    setUtmCampaign(searchParams.get("utm_campaign") || "");
    setUtmTerm(searchParams.get("utm_term") || "");
    setUtmContent(searchParams.get("utm_content") || "");
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      setExistingLink(data.link);
      setDestination(data.link.destination);
      setDomain(data.link.domain);
      setSlug(data.link.slug);
      setTags(data.link.tags);
      setNotes(data.link.notes);
      setQrCodeType(data.link.qrCode.type);
      setLogo(data.link.qrCode.logo);
      setLogoType(data.link.qrCode.logoType);
      setColor(data.link.qrCode.color);
      setLogoDimensions({
        width: data.link.qrCode.logoWidth,
        height: data.link.qrCode.logoHeight,
      });
      setSearchParams();
      setIos(data.link.ios);
      setAndroid(data.link.android);
      setGeo(data.link.geo);
      setTitle(data.link.ogTitle);
      setDescription(data.link.ogDescription);
      setImage(data.link.ogImage);
      setExpiresAt(data.link.expiresAt);
      setExpiredDestination(data.link.expired);
      setShouldCloak(data.link.shouldCloak);
      setShouldIndex(data.link.shouldIndex);
      setIsPasswordProtected(!!data.link.passwordHash);
    }
  }, [data]);

  if (isLoading) return <div>loading...</div>;

  if (error) return "an error occured";

  return (
    <>
      <div className="flex space-x-10">
        <NewLinkNav />
        <LinkForm mode="edit" />
        <LinkPreview mode="edit" />
      </div>
      <EditLinkSnackbar mutate={mutate} />
    </>
  );
};
