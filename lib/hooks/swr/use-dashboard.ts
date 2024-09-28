import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export const useDashboard = (from: Date, to: Date, timeFrame: string) => {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(
    `/api/dashboard/${slug}?from=${from}&to=${to}&timeFrame=${timeFrame}`,
    fetcher,
  );
  return { data, isLoading, error };
};
