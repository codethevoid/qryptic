import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { type Tag, Domain } from "@/types/links";

type Options = {
  tags: Tag[];
  domains: Domain[];
};

export const useOptions = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<Options>(`/api/links/${slug}/options`, fetcher);
  return { data, isLoading, error };
};
