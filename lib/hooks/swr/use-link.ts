import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { type TagColor } from "@/types/colors";
import { type LogoType } from "@/types/links";

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

export const useLink = () => {
  const { slug, id } = useParams();

  const { data, isLoading, error, mutate } = useSWR<Link>(`/api/links/${slug}/${id}`, fetcher);
  return { data, isLoading, error, mutate };
};
