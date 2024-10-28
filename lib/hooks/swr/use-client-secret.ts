import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

type ClientSecret = {
  clientSecret: string;
};

export const useClientSecret = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<ClientSecret>(
    `/api/cards/setup-intent/${slug}`,
    fetcher,
  );
  return { clientSecret: data?.clientSecret, isLoading, error };
};
