import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useLink = () => {
  const { slug, id } = useParams();

  const { data, isLoading, error, mutate } = useSWR(`/api/links/${slug}/${id}`, fetcher);
  return { data, isLoading, error, mutate };
};
