import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useTags = (page?: number, pageSize?: number) => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(
    `/api/tags/${slug}?page=${page}&pageSize=${pageSize}`,
    fetcher,
  );
  return { tags: data?.tags, totalTags: data?.totalTags, isLoading, error };
};
