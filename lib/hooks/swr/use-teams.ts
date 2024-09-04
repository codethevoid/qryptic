import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export const useTeams = () => {
  const { data, error, isLoading } = useSWR("/api/teams", fetcher);
  return { teams: data, error, isLoading };
};
