import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  defaultTeam: string | null;
  isEmailVerified: boolean;
  hasUsedTrial: boolean;
};

export const useUser = () => {
  const { data, error, isLoading } = useSWR<User>("/api/me", fetcher);
  return { user: data, error, isLoading };
};
