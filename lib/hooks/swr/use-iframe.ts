import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

type IframeData = {
  isCloakable: boolean;
};

export const useIframe = (url: string) => {
  const { slug } = useParams();

  // construct search params
  const searchParams = new URLSearchParams();
  searchParams.append("url", url);

  const { data, isLoading, error } = useSWR<IframeData>(
    `/api/cloak/${slug}?${searchParams.toString()}`,
    fetcher,
  );

  return { data, isLoading, error };
};
