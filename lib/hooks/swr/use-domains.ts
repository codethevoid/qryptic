import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useDomains = (page: number, pageSize: number, status: string, search: string) => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(
    `/api/domains/${slug}?page=${page}&pageSize=${pageSize}&status=${status}&search=${search}`,
    fetcher,
  );
  return { domains: data?.domains, count: data?.count, isLoading, error };
};
