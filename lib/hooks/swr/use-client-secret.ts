import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useClientSecret = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(`/api/cards/setup-intent/${slug}`, fetcher);
  return { clientSecret: data?.clientSecret, isLoading, error };
};
