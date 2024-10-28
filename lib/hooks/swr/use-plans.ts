import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export type Plan = {
  id: string;
  name: string;
  description: string;
  links: number;
  domains: number;
  seats: number;
  analytics: number;
  supportLevel: string;
  prices: { id: string; stripePriceId: string; price: number; interval: "year" | "month" }[];
};

export const usePlans = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<Plan[]>(`/api/plans/${slug}`, fetcher);
  return { plans: data, isLoading, error };
};
