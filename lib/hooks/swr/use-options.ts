import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { TagColor } from "@/types/colors";

type Options = {
  tags: { id: string; name: string; color: TagColor }[];
  domains: { id: string; name: string; isPrimary: boolean }[];
};

export const useOptions = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<Options>(`/api/links/${slug}/options`, fetcher);
  return { data, isLoading, error };
};
