import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useDomains = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(`/api/domains/${slug}`, fetcher);
  return { domains: data, isLoading, error };
};
