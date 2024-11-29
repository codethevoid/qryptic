"use client";

import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, MousePointer2, ScanQrCode, Infinity as InfinityIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Dashboard } from "@/types/dashboard";

type MetricsProps = {
  isLoading: boolean;
  data: Dashboard | undefined;
};

export const Metrics = ({ data, isLoading }: MetricsProps) => {
  const { slug } = useParams();

  const getVariant = (percentChange: number) => {
    if (percentChange > 0) return "success";
    if (percentChange < 0) return "orange";
    return "neutral";
  };

  return (
    <div className="mt-6 grid grid-cols-3 gap-5 max-[768px]:mt-3 max-[750px]:grid-cols-1 max-[750px]:grid-rows-3">
      <NextLink href={`/${slug}/links`} passHref>
        <Card className="w-full space-y-2 p-4 shadow transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Events</p>
              {!isLoading && data ? (
                <Badge
                  className="flex h-[18px] px-2 text-[11px]"
                  variant={getVariant(data.eventPercentChange)}
                >
                  {data?.eventPercentChange > 0 ? (
                    <span
                      className={
                        data.eventPercentChange === Infinity ? "relative bottom-[1px]" : undefined
                      }
                    >
                      +
                    </span>
                  ) : (
                    ""
                  )}
                  {data.eventPercentChange === Infinity ? (
                    <InfinityIcon size={12} className="ml-0.5" />
                  ) : (
                    data.eventPercentChange.toLocaleString("en-us")
                  )}
                  {data.eventPercentChange !== Infinity && "%"}
                </Badge>
              ) : (
                <Skeleton className="h-[18px] w-12 rounded-full" />
              )}
            </div>
            <Link2 size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            {!isLoading && data ? (
              <p className="text-2xl font-bold">{data.eventCount.toLocaleString("en-us")}</p>
            ) : (
              // <NumberFlow value={data.links.count} />
              <div className="flex h-8 items-center">
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            )}
            {!isLoading && data ? (
              <p className="text-xs text-muted-foreground">
                {data.prevEventCount.toLocaleString("en-us")} previous period
              </p>
            ) : (
              <div className="flex h-4 items-center">
                <Skeleton className="h-3.5 w-32 rounded-md" />
              </div>
            )}
          </div>
        </Card>
      </NextLink>
      <NextLink href={`/${slug}/analytics`} passHref>
        <Card className="w-full space-y-2 p-4 shadow transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Clicks</p>
              {!isLoading && data ? (
                <Badge
                  className="flex h-[18px] px-2 text-[11px]"
                  variant={getVariant(data.clicks.percentChange)}
                >
                  {data.clicks.percentChange > 0 ? (
                    <span
                      className={
                        data.clicks.percentChange === Infinity ? "relative bottom-[1px]" : undefined
                      }
                    >
                      +
                    </span>
                  ) : (
                    ""
                  )}
                  {data.clicks.percentChange === Infinity ? (
                    <InfinityIcon size={12} className="ml-0.5" />
                  ) : (
                    data?.clicks.percentChange.toLocaleString("en-us")
                  )}
                  {data.clicks.percentChange !== Infinity && "%"}
                </Badge>
              ) : (
                <Skeleton className="h-[18px] w-12 rounded-full" />
              )}
            </div>
            <MousePointer2 size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            {!isLoading && data ? (
              <p className="text-2xl font-bold">{data.clicks.count.toLocaleString("en-us")}</p>
            ) : (
              <div className="flex h-8 items-center">
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            )}
            {!isLoading && data ? (
              <p className="text-xs text-muted-foreground">
                {data.clicks.prevCount.toLocaleString("en-us")} previous period
              </p>
            ) : (
              <div className="flex h-4 items-center">
                <Skeleton className="h-3.5 w-32 rounded-md" />
              </div>
            )}
          </div>
        </Card>
      </NextLink>
      <NextLink href={`/${slug}/analytics`} passHref>
        <Card className="w-full space-y-2 p-4 shadow transition-all hover:border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Scans</p>
              {!isLoading && data ? (
                <Badge
                  className="flex h-[18px] px-2 text-[11px]"
                  variant={getVariant(data.scans.percentChange)}
                >
                  {data?.scans.percentChange > 0 || data.scans.percentChange === Infinity ? (
                    <span
                      className={
                        data?.scans.percentChange === Infinity ? "relative bottom-[1px]" : undefined
                      }
                    >
                      +
                    </span>
                  ) : (
                    ""
                  )}
                  {data?.scans.percentChange === Infinity ? (
                    <InfinityIcon size={12} className="ml-0.5" />
                  ) : (
                    data?.scans.percentChange.toLocaleString("en-us")
                  )}
                  {data?.scans.percentChange !== Infinity && "%"}
                </Badge>
              ) : (
                <Skeleton className="h-[18px] w-12 rounded-full" />
              )}
            </div>
            <ScanQrCode size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            {!isLoading && data ? (
              <p className="text-2xl font-bold">{data.scans.count.toLocaleString("en-us")}</p>
            ) : (
              <div className="flex h-8 items-center">
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            )}
            {!isLoading && data ? (
              <p className="text-xs text-muted-foreground">
                {data.scans.prevCount.toLocaleString("en-us")} previous period
              </p>
            ) : (
              <div className="flex h-4 items-center">
                <Skeleton className="h-3.5 w-32 rounded-md" />
              </div>
            )}
          </div>
        </Card>
      </NextLink>
    </div>
  );
};
