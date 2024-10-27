"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { differenceInDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { aggregateEvents } from "@/lib/formatters/aggregate";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { type Event } from "@/types/analytics";

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
    label: "Events",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type AreaDataType = "events" | "clicks" | "scans";

type Props = {
  events: Event[] | undefined;
  date: DateRange | undefined;
  isLoading: boolean;
};

export const AnalyticsChart = ({ events = [], date, isLoading }: Props) => {
  const [areas, setAreas] = useState<AreaDataType[]>(["events"]);

  // memoize the chart data
  // so we dont have to recompute it on every render
  const chartData = useMemo(() => {
    return aggregateEvents(date as DateRange, events);
  }, [events, date]);

  const formatTick = (tick: string) => {
    const diff = differenceInDays(date?.to as Date, date?.from as Date);
    if (diff === 0) return tick;
    return format(new Date(tick), "MMM d");
  };

  const formatTooltipLabel = (label: string) => {
    const diff = differenceInDays(date?.to as Date, date?.from as Date);
    if (diff === 0) {
      return `${label.split(" ")[0]}:00 ${label.split(" ")[1]}`;
    }
    return format(new Date(label), "MMM d, yyyy");
  };

  const formatYTick = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  const handleAreaChange = (area: AreaDataType) => {
    if (areas.length === 1 && areas.includes(area)) {
      setAreas(["events"]);
      return;
    }
    if (areas.includes(area)) {
      setAreas(areas.filter((a) => a !== area));
    } else {
      setAreas([...areas, area]);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border shadow">
      <div className="w-full border-b bg-zinc-50 dark:bg-zinc-950">
        <div className="flex w-full min-[700px]:max-w-[440px]">
          <div
            className={cn(
              "relative w-full justify-center space-y-0.5 border-r p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/60 max-[700px]:p-3",
            )}
            role="button"
            onClick={() => handleAreaChange("events")}
          >
            <div className="items-flex flex items-center space-x-2">
              <span className="relative bottom-[0.5px] h-2.5 w-2.5 rounded-[2px] border border-[hsl(var(--chart-4))] bg-[hsl(var(--chart-4))]" />
              <p className="text-[13px] text-muted-foreground">Events</p>
            </div>
            {!isLoading ? (
              <p className="text-lg font-bold min-[700px]:text-xl">
                {events?.length.toLocaleString("en-us")}
              </p>
            ) : (
              <div className="flex h-7 items-end">
                <Skeleton className="h-6 w-20" />
              </div>
            )}
            <span
              className={cn(
                "absolute -bottom-[1px] left-0 h-0.5 w-full bg-transparent transition-colors",
                areas.includes("events") && "bg-primary",
              )}
            />
          </div>
          <div
            className={cn(
              "relative w-full space-y-0.5 border-r p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/60 max-[700px]:p-3",
              // areas.includes("clicks") && "bg-zinc-100 dark:bg-zinc-900/60",
            )}
            role="button"
            onClick={() => handleAreaChange("clicks")}
          >
            <div className="flex items-center space-x-2">
              <span className="relative bottom-[0.5px] h-2.5 w-2.5 rounded-[2px] border border-[hsl(var(--chart-1))] bg-[hsl(var(--chart-1))]" />
              <p className="text-[13px] text-muted-foreground">Clicks</p>
            </div>
            {!isLoading ? (
              <p className="text-lg font-bold min-[700px]:text-xl">
                {events?.filter((e: any) => e.type === "click").length.toLocaleString("en-us")}
              </p>
            ) : (
              <div className="flex h-7 items-end">
                <Skeleton className="h-6 w-20" />
              </div>
            )}
            <span
              className={cn(
                "absolute -bottom-[1px] -left-[1px] h-0.5 w-[calc(100%+2px)] bg-transparent transition-colors",
                areas.includes("clicks") && "bg-primary",
              )}
            />
          </div>
          <div
            className="relative w-full justify-center space-y-0.5 p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/60 max-[700px]:p-3 min-[700px]:border-r"
            role="button"
            onClick={() => handleAreaChange("scans")}
          >
            <div className="flex items-center space-x-2">
              <span className="relative bottom-[0.5px] h-2.5 w-2.5 rounded-[2px] border border-[hsl(var(--chart-2))] bg-[hsl(var(--chart-2))]" />
              <p className="text-[13px] text-muted-foreground">Scans</p>
            </div>
            {!isLoading ? (
              <p className="text-lg font-bold min-[700px]:text-xl">
                {events?.filter((e: any) => e.type === "scan").length.toLocaleString("en-us")}
              </p>
            ) : (
              <div className="flex h-7 items-end">
                <Skeleton className="h-6 w-20" />
              </div>
            )}
            <span
              className={cn(
                "absolute -bottom-[1px] left-0 h-0.5 w-full bg-transparent transition-colors",
                areas.includes("scans") && "bg-primary",
              )}
            />
          </div>
        </div>
      </div>
      <div className="p-8 pl-6 max-[700px]:p-4 max-[700px]:pl-1 max-[700px]:pt-6">
        <ChartContainer
          config={chartConfig}
          className={"max-h-[400px] w-full max-[700px]:min-h-[260px]"}
        >
          <AreaChart data={chartData} margin={{ left: -20, top: 8, right: 12 }}>
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
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={(tick: number) => formatYTick(tick)}
            />
            <CartesianGrid vertical={false} strokeDasharray={3} />
            {areas.includes("events") && (
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fillTotal)"
                fillOpacity={0.4}
                stroke="var(--color-total)"
                stackId="a"
                strokeWidth={1.5}
              />
            )}
            {areas.includes("clicks") && (
              <Area
                dataKey="clicks"
                type="monotone"
                fill="url(#fillClicks)"
                fillOpacity={0.4}
                stroke="var(--color-clicks)"
                stackId="b"
                strokeWidth={1.5}
              />
            )}
            {areas.includes("scans") && (
              <Area
                dataKey="scans"
                type="monotone"
                fill="url(#fillScans)"
                fillOpacity={0.4}
                stroke="var(--color-scans)"
                stackId="c"
                strokeWidth={1.5}
              />
            )}
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-scans)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-scans)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};
