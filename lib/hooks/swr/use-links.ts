import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { type LinksTable } from "@/types/links";
import { TagColor } from "@/types/colors";

type UseLinksProps = {
  status: string[];
  search: string;
  tags: { id: string; name: string; color: TagColor }[];
  domains: { id: string; name: string }[];
  page: number;
  pageSize: number;
  sort: "date" | "activity";
};

export const useLinks = ({
  status,
  search,
  tags,
  domains,
  page,
  pageSize,
  sort,
}: UseLinksProps) => {
  const { slug } = useParams();

  // construct searchParams
  const searchParams = new URLSearchParams();
  searchParams.append("status", status.join(","));
  searchParams.append("search", search);
  searchParams.append("tags", tags.map((t) => t.id).join(","));
  searchParams.append("domains", domains.map((d) => d.id).join(","));
  searchParams.append("page", String(page));
  searchParams.append("pageSize", String(pageSize));
  searchParams.append("sort", sort);

  const { data, isLoading, error, mutate } = useSWR<LinksTable>(
    `/api/links/${slug}?${searchParams.toString()}`,
    fetcher,
  );
  return { data, isLoading, error, mutate };
};
