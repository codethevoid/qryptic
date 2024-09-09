import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useTeamSettings = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(`/api/teams/${slug}/settings`, fetcher, {
    // dedupingInterval: 60000, // 1 minute
  });

  return { settings: data, isLoading, error };
};
