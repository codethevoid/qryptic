import useSWR from "swr";
import { useParams } from "next/navigation";
import { fetcher } from "@/utils/fetcher";
import { type TeamSettings } from "@/lib/hooks/swr/use-team-settings";

export type Team = {
  id: string;
  slug: string;
  name: string;
  image: string;
  company: string;
  subscriptionStatus: TeamSettings["subscriptionStatus"];
  trialsEndsAt: Date | null;
  hasPaymentMethod: boolean;
  plan: {
    id: string;
    name: string;
    isFree: boolean;
    analytics: number;
    domains: number;
    seats: number;
    links: number;
  };
  user: { role: "owner" | "member" };
};

export const useTeam = () => {
  const { slug } = useParams();
  const { data, error, isLoading } = useSWR<Team>(slug ? `/api/teams/${slug}` : null, fetcher);

  return { team: data, error, isLoading };
};
