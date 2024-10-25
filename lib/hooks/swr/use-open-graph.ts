import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Opengraph } from "@/types/links";

export const useOpenGraph = (url?: string) => {
  const { slug } = useParams();

  // construct search params
  const searchParams = new URLSearchParams();
  searchParams.append("url", url || "");

  const { data, isLoading, error } = useSWR<Opengraph>(
    `/api/open-graph/${slug}?${searchParams.toString()}`,
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );
  return { data, isLoading, error };
};
