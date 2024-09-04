import useSWR from "swr";
import { useParams } from "next/navigation";

export const useTeam = () => {
  const { slug } = useParams();
  // const { data, error, isLoading } = useSWR(`/api/teams/${slug}`);
  return { team: { name: "Team name" } };
};
