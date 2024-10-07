import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { TagWithCounts } from "@/types/tags";

type TagsPayload = {
  tags: TagWithCounts[];
  totalTags: number;
};

export const useTags = (page: number, pageSize: number, search: string) => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<TagsPayload>(
    `/api/tags/${slug}?page=${page}&pageSize=${pageSize}&search=${search}`,
    fetcher,
  );
  return { tags: data?.tags, totalTags: data?.totalTags, isLoading, error };
};
