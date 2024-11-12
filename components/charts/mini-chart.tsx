"use client";

import { DateRange } from "react-day-picker";
import { aggregateEvents } from "@/lib/formatters/aggregate";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";

type Event = {
  createdAt: Date;
  type: "click" | "scan";
};

type MiniChartProps = {
  events: Event[];
  date: DateRange | undefined;
};

const chartConfig = {
  events: {
    label: "Events",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export const MiniChart = ({ events, date }: MiniChartProps) => {
  const chartData = aggregateEvents(date as DateRange, events);

  return (
    <ChartContainer config={chartConfig} className="h-8 w-full max-w-20 shrink-0">
      <AreaChart data={chartData}>
        <Area
          dataKey="total"
          type="monotone"
          fill="url(#fillEvents)"
          fillOpacity={0.4}
          stroke="var(--color-events)"
          strokeWidth={1.5}
        />
        <defs>
          <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-events)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-events)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ChartContainer>
  );
};
