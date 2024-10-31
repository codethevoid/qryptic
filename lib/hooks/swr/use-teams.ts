import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export type Team = {
  id: string;
  name: string;
  slug: string;
  image: string;
  members: number;
  plan: { name: string; seats: number; isFree: boolean };
  domains: { id: string; name: string; isPrimary: boolean }[];
  _count: { events: number; links: number };
};

export const useTeams = () => {
  const { data, error, isLoading } = useSWR<Team[]>("/api/teams", fetcher);
  return { teams: data, error, isLoading };
};
