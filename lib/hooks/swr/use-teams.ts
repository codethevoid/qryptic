import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Team } from "@prisma/client";

export const useTeams = () => {
  const { data, error, isLoading } = useSWR<Team[]>("/api/teams", fetcher);
  return { teams: data, error, isLoading };
};
