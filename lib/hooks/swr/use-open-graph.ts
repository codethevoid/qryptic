import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Opengraph } from "@/types/links";

export const useOpenGraph = (url?: string) => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<Opengraph>(
    `/api/open-graph/${slug}?url=${url}`,
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );
  return { data, isLoading, error };
};
