import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@prisma/client";

type CustomUser = Pick<User, "id" | "email" | "name" | "image" | "defaultTeam">;

export const useUser = () => {
  const { data, error, isLoading } = useSWR<CustomUser>("/api/me", fetcher);
  return { user: data, error, isLoading };
};
