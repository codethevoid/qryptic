import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export type Domain = {
  id: string;
  createdAt: string;
  name: string;
  isArchived: boolean;
  isDefault: boolean;
  isPrimary: boolean;
  isVerified: boolean;
  destination: string;
  isSubdomain: boolean;
  _count: { links: number };
};

type Domains = {
  domains: Domain[];
  count: number;
};

export const useDomains = (page: number, pageSize: number, status: string, search: string) => {
  const { slug } = useParams();

  const { data, isLoading, error } = useSWR<Domains>(
    `/api/domains/${slug}?page=${page}&pageSize=${pageSize}&status=${status}&search=${search}`,
    fetcher,
  );
  console.log(data);
  return { domains: data?.domains, count: data?.count, isLoading, error };
};
