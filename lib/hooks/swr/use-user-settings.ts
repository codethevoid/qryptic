import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { TeamMember } from "@prisma/client";

export type UserSettings = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isEmailVerified: boolean;
  googleAuth: boolean;
  credentialsAuth: boolean;
  teams: {
    role: TeamMember["role"];
    team: {
      id: string;
      name: string;
      slug: string;
      image: string;
    };
  }[];
  defaultTeam: string | null;
};

export const useUserSettings = () => {
  const { data, error, isLoading, mutate } = useSWR<UserSettings>("/api/me/settings", fetcher);
  return { data, error, isLoading, mutate };
};
