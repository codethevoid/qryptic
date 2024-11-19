import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useDefaultDomains = () => {
  const { slug } = useParams();
  const { data, isLoading, error, mutate } = useSWR(
    `/api/domains/${slug}/default-domains`,
    fetcher,
  );

  return { data, isLoading, error, mutate };
};
