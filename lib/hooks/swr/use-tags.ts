import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useTags = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(`/api/tags/${slug}`, fetcher);
  return { tags: data?.tags, isLoading, error };
};
