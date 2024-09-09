import useSWR from "swr";
import { useParams } from "next/navigation";
import { fetcher } from "@/utils/fetcher";

export const useTeam = () => {
  const { slug } = useParams();
  const { data, error, isLoading } = useSWR(slug ? `/api/teams/${slug}` : null, fetcher, {
    // shouldRetryOnError: false,
  });
  return { team: data, error, isLoading };
};
