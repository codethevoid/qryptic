import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Dashboard } from "@/types/dashboard";

export const useDashboard = (from: Date, to: Date, timeFrame: string) => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR<Dashboard>(
    `/api/dashboard/${slug}?from=${from}&to=${to}&timeFrame=${timeFrame}`,
    fetcher,
  );

  // parse any infinity values
  if (data) {
    if (typeof data.links.percentChange === "string") {
      data.links.percentChange = Number(data.links.percentChange);
    }
    if (typeof data.clicks.percentChange === "string") {
      data.clicks.percentChange = Number(data.clicks.percentChange);
    }
    if (typeof data.scans.percentChange === "string") {
      data.scans.percentChange = Number(data.scans.percentChange);
    }
  }

  return { data, isLoading, error };
};
