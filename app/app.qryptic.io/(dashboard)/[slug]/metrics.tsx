"use client";

import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Infinity, Link2, MousePointer, MousePointer2, ScanQrCode } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

type MetricsProps = {
  isLoading: boolean;
  data: Record<string, any> | null;
};

export const Metrics = ({ data, isLoading }: MetricsProps) => {
  const { slug } = useParams();
  return (
    <div className="mt-6 grid grid-cols-3 gap-5 max-[750px]:grid-cols-1 max-[750px]:grid-rows-3">
      <NextLink href={`/${slug}/links`} passHref>
        <Card className="w-full space-y-2 p-4 shadow transition-all hover:shadow-lg dark:hover:border-zinc-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Links</p>
              {!isLoading ? (
                <Badge
                  className="flex h-[18px] px-2 text-[11px]"
                  variant={
                    data?.links.percentChange > 0
                      ? "success"
                      : data?.links.percentChange === 0
                        ? "neutral"
                        : "orange"
                  }
                >
                  {data?.links.percentChange > 0 || data?.links.percentChange === "Infinity" ? (
                    <span
                      className={
                        data?.links.percentChange === "Infinity"
                          ? "relative bottom-[1px]"
                          : undefined
                      }
                    >
                      +
                    </span>
                  ) : (
                    ""
                  )}
                  {data?.links.percentChange === "Infinity" ? (
                    <Infinity size={12} className="ml-0.5" />
                  ) : (
                    data?.links.percentChange.toLocaleString("en-us")
                  )}
                  {data?.links.percentChange !== "Infinity" && "%"}
                </Badge>
              ) : (
                <Skeleton className="h-[18px] w-12 rounded-full" />
              )}
            </div>
            <Link2 size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            {!isLoading ? (
              <p className="text-2xl font-bold">{data?.links.count.toLocaleString("en-us")}</p>
            ) : (
              <div className="flex h-8 items-center">
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            )}
            {!isLoading ? (
              <p className="text-xs text-muted-foreground">
                {data?.links.prevCount.toLocaleString("en-us")} previous period
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
        <Card className="w-full space-y-2 p-4 shadow transition-all hover:shadow-lg dark:hover:border-zinc-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Clicks</p>
              {!isLoading ? (
                <Badge
                  className="flex h-[18px] px-2 text-[11px]"
                  variant={
                    data?.clicks.percentChange > 0
                      ? "success"
                      : data?.clicks.percentChange === 0
                        ? "neutral"
                        : "orange"
                  }
                >
                  {data?.clicks.percentChange > 0 || data?.clicks.percentChange === "Infinity" ? (
                    <span
                      className={
                        data?.clicks.percentChange === "Infinity"
                          ? "relative bottom-[1px]"
                          : undefined
                      }
                    >
                      +
                    </span>
                  ) : (
                    ""
                  )}
                  {data?.clicks.percentChange === "Infinity" ? (
                    <Infinity size={12} className="ml-0.5" />
                  ) : (
                    data?.clicks.percentChange.toLocaleString("en-us")
                  )}
                  {data?.clicks.percentChange !== "Infinity" && "%"}
                </Badge>
              ) : (
                <Skeleton className="h-[18px] w-12 rounded-full" />
              )}
            </div>
            <MousePointer2 size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            {!isLoading ? (
              <p className="text-2xl font-bold">{data?.clicks.count.toLocaleString("en-us")}</p>
            ) : (
              <div className="flex h-8 items-center">
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            )}
            {!isLoading ? (
              <p className="text-xs text-muted-foreground">
                {data?.clicks.prevCount.toLocaleString("en-us")} previous period
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
        <Card className="w-full space-y-2 p-4 shadow transition-all hover:shadow-lg dark:hover:border-zinc-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm">Scans</p>
              {!isLoading ? (
                <Badge
                  className="flex h-[18px] px-2 text-[11px]"
                  variant={
                    data?.scans.percentChange > 0
                      ? "success"
                      : data?.scans.percentChange === 0
                        ? "neutral"
                        : "orange"
                  }
                >
                  {data?.scans.percentChange > 0 || data?.scans.percentChange === "Infinity" ? (
                    <span
                      className={
                        data?.scans.percentChange === "Infinity"
                          ? "relative bottom-[1px]"
                          : undefined
                      }
                    >
                      +
                    </span>
                  ) : (
                    ""
                  )}
                  {data?.scans.percentChange === "Infinity" ? (
                    <Infinity size={12} className="ml-0.5" />
                  ) : (
                    data?.scans.percentChange.toLocaleString("en-us")
                  )}
                  {data?.scans.percentChange !== "Infinity" && "%"}
                </Badge>
              ) : (
                <Skeleton className="h-[18px] w-12 rounded-full" />
              )}
            </div>
            <ScanQrCode size={15} className="text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            {!isLoading ? (
              <p className="text-2xl font-bold">{data?.scans.count.toLocaleString("en-us")}</p>
            ) : (
              <div className="flex h-8 items-center">
                <Skeleton className="h-7 w-20 rounded-lg" />
              </div>
            )}
            {!isLoading ? (
              <p className="text-xs text-muted-foreground">
                {data?.scans.prevCount.toLocaleString("en-us")} previous period
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
