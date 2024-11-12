"use client";

import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { aggregateEvents } from "@/lib/formatters/aggregate";
import { differenceInDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { Dashboard } from "@/types/dashboard";
import { TimeFrame } from "@/types/analytics";
import { useMemo } from "react";

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-1))",
  },
  scans: {
    label: "Scans",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type EventChartProps = {
  data: Dashboard | undefined;
  isLoading: boolean;
  date: DateRange | undefined;
  timeFrame?: TimeFrame;
};

export const EventChart = ({ data, date, isLoading, timeFrame }: EventChartProps) => {
  const { slug } = useParams();

  const chartData = useMemo(() => {
    return aggregateEvents(date as DateRange, data?.events, timeFrame);
  }, [date, data, timeFrame]);

  const formatTick = (tick: string) => {
    const diff = differenceInDays(date?.to as Date, date?.from as Date);
    if (diff === 0) return tick;

    // Ensure the tick is in a format that Safari can handle
    const parsedDate = new Date(tick.replace(/-/g, "/")); // Replacing dashes with slashes can sometimes help
    return !isNaN(parsedDate.getTime()) ? format(parsedDate, "MMM d") : tick;
  };

  const formatTooltipLabel = (label: string) => {
    const diff = differenceInDays(date?.to as Date, date?.from as Date);
    if (diff === 0) {
      return `${label.split(" ")[0]}:00 ${label.split(" ")[1]}`;
    }

    const parsedDate = new Date(label.replace(/-/g, "/"));
    return !isNaN(parsedDate.getTime()) ? format(parsedDate, "MMM d, yyyy") : label;
  };

  // const formatYTick = (num: number) => {
  //   if (num >= 1000000) {
  //     return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  //   } else if (num >= 1000) {
  //     return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  //   }
  //   return num.toString();
  // };

  return (
    <div className="max-[800px]:col-span-5 min-[800px]:col-span-3">
      <Card>
        <CardHeader className="space-y-0.5 p-4">
          <div className="flex items-center justify-between">
            {!isLoading && data ? (
              <CardTitle>
                {data?.events.length > 0
                  ? `${data?.events.length.toLocaleString("en-us")} events captured`
                  : "No events captured"}
              </CardTitle>
            ) : (
              <Skeleton className="h-5 w-32" />
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-7 items-center space-x-1.5 text-xs"
              disabled={isLoading}
              asChild
            >
              <NextLink href={`/${slug}/analytics`} passHref>
                <span>Analyze</span>
                {/*<ArrowRight size={12} />*/}
              </NextLink>
            </Button>
          </div>
          {!isLoading ? (
            <CardDescription className="text-[13px]">
              {format(date?.from as Date, "MMM d, yyyy")} -{" "}
              {format(date?.to as Date, "MMM d, yyyy")}
            </CardDescription>
          ) : (
            <div className="flex h-[19.5px] items-center">
              <Skeleton className="h-4 w-44" />
            </div>
          )}
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <ChartContainer config={chartConfig} className={"h-[347px] w-full max-[800px]:h-[280px]"}>
            <AreaChart
              data={chartData}
              // margin={{ left: -20, top: 8, right: 12 }}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(label) => formatTooltipLabel(label)}
                  />
                }
              />

              <XAxis
                dataKey="interval"
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                minTickGap={32}
                tickFormatter={(tick: string) => formatTick(tick)}
              />
              {/*<YAxis*/}
              {/*  axisLine={false}*/}
              {/*  tickLine={false}*/}
              {/*  allowDecimals={false}*/}
              {/*  tickFormatter={(tick: number) => formatYTick(tick)}*/}
              {/*/>*/}
              <CartesianGrid vertical={false} strokeDasharray={3} />
              <Area
                dataKey="clicks"
                type="monotone"
                fill="url(#fillClicks)"
                fillOpacity={0.4}
                stroke="var(--color-clicks)"
                stackId="a"
                strokeWidth={1.5}
              />
              <Area
                dataKey="scans"
                type="monotone"
                fill="url(#fillScans)"
                fillOpacity={0.4}
                stroke="var(--color-scans)"
                stackId="b"
                strokeWidth={1.5}
              />
              <defs>
                <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-scans)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-scans)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
