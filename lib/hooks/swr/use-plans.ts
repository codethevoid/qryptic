import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { PlanWithPrices } from "@/types/plans";

export const usePlans = () => {
  const { data, isLoading, error } = useSWR<PlanWithPrices[]>("/api/plans", fetcher);
  return { plans: data, isLoading, error };
};
