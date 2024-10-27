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
  console.log(data);
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
    if (!data?.destination) return;
    const searchParams = new URLSearchParams(data.destination?.split("?")[1]);
    setUtmSource(searchParams.get("utm_source") || "");
    setUtmMedium(searchParams.get("utm_medium") || "");
    setUtmCampaign(searchParams.get("utm_campaign") || "");
    setUtmTerm(searchParams.get("utm_term") || "");
    setUtmContent(searchParams.get("utm_content") || "");
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      setExistingLink(data);
      setDestination(data.destination);
      setDomain(data.domain);
      setSlug(data.slug);
      setTags(data.tags);
      setNotes(data.notes);
      setQrCodeType(data.qrCode.type);
      setLogo(data.qrCode.logo);
      setLogoType(data.qrCode.logoType);
      setColor(data.qrCode.color);
      setLogoDimensions({
        width: data.qrCode.logoWidth,
        height: data.qrCode.logoHeight,
      });
      setSearchParams();
      setIos(data.ios);
      setAndroid(data.android);
      setGeo(data.geo);
      setTitle(data.ogTitle);
      setDescription(data.ogDescription);
      setImage(data.ogImage);
      setExpiresAt(data.expiresAt);
      setExpiredDestination(data.expired);
      setShouldCloak(data.shouldCloak);
      setShouldIndex(data.shouldIndex);
      setIsPasswordProtected(!!data.passwordHash);
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
