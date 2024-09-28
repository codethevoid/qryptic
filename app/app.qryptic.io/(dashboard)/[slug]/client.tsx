"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronDown,
  Globe,
  Infinity,
  Link2,
  Lock,
  Minus,
  MousePointer2,
  Plus,
  ScanQrCode,
  Tag,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { adminRoles } from "@/lib/constants/roles";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import {
  subDays,
  format,
  startOfToday,
  startOfMonth,
  differenceInDays,
  subMonths,
  startOfYear,
} from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectLabel,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDashboard } from "@/lib/hooks/swr/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

type TimeFrame =
  | "today"
  | "sevenDays"
  | "fourWeeks"
  | "threeMonths"
  | "twelveMonths"
  | "threeYears"
  | "monthToDate"
  | "yearToDate"
  | "all"
  | "custom";

const daysMap: Record<TimeFrame, number> = {
  today: 0,
  sevenDays: 6,
  fourWeeks: 27,
  threeMonths: differenceInDays(startOfToday(), subMonths(startOfToday(), 3)) - 1,
  twelveMonths: differenceInDays(startOfToday(), subMonths(startOfToday(), 12)) - 1,
  threeYears: differenceInDays(startOfToday(), subMonths(startOfToday(), 36)) - 1,
  monthToDate: differenceInDays(startOfToday(), startOfMonth(new Date())),
  yearToDate: differenceInDays(startOfToday(), startOfYear(new Date())),
  all: 0,
  custom: 0,
};

export const HomeClient = () => {
  const { slug } = useParams();
  const { team } = useTeam();
  const today = startOfToday();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("fourWeeks");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(today, daysMap["fourWeeks"]),
    to: today,
  });

  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);

  const { data, error, isLoading } = useDashboard(date?.from as Date, date?.to as Date, timeFrame);
  console.log(data);
  // const isLoading = true;

  const handleTimeFrameChange = (value: TimeFrame) => {
    setTimeFrame(value);
    setDate({
      from: subDays(today, daysMap[value]),
      to: today,
    });
    setTempDate({
      from: subDays(today, daysMap[value]),
      to: today,
    });
  };

  const handleDateChange = async () => {
    // check if the date range is invalid
    const isInvalidDate = !tempDate || !tempDate.from || !tempDate.to;
    if (isInvalidDate) {
      return setTempDate({
        from: subDays(today, daysMap[timeFrame]),
        to: today,
      });
    }

    // check if the date range can be selected (based off plan)
    // get from date and check how many days in the past it is and compare to the plan max days
    const fromDate = tempDate?.from;
    // subtract from date from today to get the number of days
    const days = differenceInDays(today, fromDate as Date) + 1;
    // check if the days is greater than the plan max days
    if (days > team?.plan.analytics) {
      // if it is greater, set date back to the previous date range ( timeframe)
      setDate({
        from: subDays(today, daysMap[timeFrame]),
        to: today,
      });
      setTempDate({
        from: subDays(today, daysMap[timeFrame]),
        to: today,
      });
      // show a toast message
      return toast.error(`Date range exceeded!`, {
        description: `The date range selected is greater than the allowed range of ${team?.plan.analytics} days. Upgrade your plan to increase historical data.`,
      });
    }

    // Compare tempDate with date; if they are the same, do not proceed
    if (
      tempDate.from?.getTime() === date?.from?.getTime() &&
      tempDate.to?.getTime() === date?.to?.getTime()
    ) {
      // If no change, simply return without setting a new state
      return;
    }

    setTimeFrame("custom");
    setDate(tempDate);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Overview</p>
        <div className="flex items-center space-x-2">
          <div className="flex">
            <Select
              value={timeFrame}
              onValueChange={(value: TimeFrame) => handleTimeFrameChange(value)}
            >
              <SelectTrigger className="h-8 space-x-2 min-[750px]:rounded-r-none">
                <span>
                  {timeFrame === "today"
                    ? "Today"
                    : timeFrame === "sevenDays"
                      ? "Last 7 days"
                      : timeFrame === "fourWeeks"
                        ? "Last 4 weeks"
                        : timeFrame === "threeMonths"
                          ? "Last 3 months"
                          : timeFrame === "twelveMonths"
                            ? "Last 12 months"
                            : timeFrame === "threeYears"
                              ? "Last 3 years"
                              : timeFrame === "monthToDate"
                                ? "Month to date"
                                : timeFrame === "yearToDate"
                                  ? "Year to date"
                                  : timeFrame === "custom"
                                    ? "Custom"
                                    : "All time"}
                </span>
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
                <SelectGroup>
                  {timeFrame === "custom" && <SelectItem value="custom">Custom</SelectItem>}
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="sevenDays">Last 7 days</SelectItem>
                  <SelectItem value="fourWeeks">Last 4 weeks</SelectItem>
                  <SelectItem value="threeMonths" disabled={team?.plan.isFree}>
                    <div className="flex items-center space-x-2">
                      {team?.plan.isFree && <Lock size={13} />}
                      <span>Last 3 months</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="twelveMonths" disabled={team?.plan.isFree}>
                    <div className="flex items-center space-x-2">
                      {team?.plan.isFree && <Lock size={13} />}
                      <span>Last 12 months</span>
                    </div>
                  </SelectItem>
                  {team?.plan.analytics >= 1096 && (
                    <SelectItem value="threeYears">Last 3 years</SelectItem>
                  )}
                  {team?.plan.isFree && (
                    <SelectItem value="threeYears" disabled>
                      <div className="flex items-center space-x-2">
                        <Lock size={13} />
                        <span>Last 3 years</span>
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value="monthToDate" disabled={team?.plan.isFree}>
                    <div className="flex items-center space-x-2">
                      {team?.plan.isFree && <Lock size={13} />}
                      <span>Month to date</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="yearToDate" disabled={team?.plan.isFree}>
                    <div className="flex items-center space-x-2">
                      {team?.plan.isFree && <Lock size={13} />}
                      <span>Year to date</span>
                    </div>
                  </SelectItem>
                  {team?.plan.analytics < 1096 && !team?.plan.isFree && (
                    <SelectItem value="threeYears" disabled>
                      <div className="flex items-center space-x-2">
                        <Lock size={13} />
                        <span>Last 3 years</span>
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value="all" disabled>
                    <div className="flex items-center space-x-2">
                      <Lock size={13} />
                      <span>All time</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Popover
              open={isCalendarOpen}
              onOpenChange={(isOpen: boolean) => {
                setIsCalendarOpen(isOpen);
                if (!isOpen) handleDateChange();
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={`space-x-2 rounded-l-none border-l-0 active:!scale-100 max-[750px]:hidden ${!tempDate && "text-muted-foreground"}`}
                >
                  <CalendarDays size={14} />
                  <span>
                    {tempDate?.from ? (
                      tempDate.to ? (
                        <>
                          {format(tempDate.from as Date, "MMM d, yyyy")} -{" "}
                          {format(tempDate.to as Date, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(tempDate.from as Date, "MMM dd, yyyy")
                      )
                    ) : (
                      "Select date"
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={7} className="w-auto p-0">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={tempDate}
                  onSelect={setTempDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="space-x-1 active:!scale-100" size="sm">
                <span>Add new</span>
                <ChevronDown size={14} className="relative top-[1px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={7}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem className="space-x-2">
                <Link2 size={13} className="-rotate-45" />
                <span className="text-[13px]">Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="space-x-2">
                <Globe size={13} />
                <span className="text-[13px]">Domain</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="space-x-2">
                <Tag size={13} />
                <span className="text-[13px]">Tag</span>
              </DropdownMenuItem>
              {adminRoles.includes(team?.user?.role) && (
                <NextLink href={`/${slug}/settings/members`} passHref>
                  <DropdownMenuItem className="space-x-2">
                    <User size={13} />
                    <span className="text-[13px]">Member</span>
                  </DropdownMenuItem>
                </NextLink>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 max-[750px]:grid-cols-1 max-[750px]:grid-rows-3">
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
                      data?.links.percentChange
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
                <p className="text-2xl font-bold">{data?.links.count}</p>
              ) : (
                <div className="flex h-8 items-center">
                  <Skeleton className="h-7 w-20 rounded-lg" />
                </div>
              )}
              {!isLoading ? (
                <p className="text-xs text-muted-foreground">
                  {data?.links.prevCount} previous period
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
                <Badge className="h-[18px] px-2 text-[11px]" variant="orange">
                  -52%
                </Badge>
              </div>
              <MousePointer2 size={15} className="text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold">508,342</p>
              <p className="text-xs text-muted-foreground">+52% from previous period</p>
            </div>
          </Card>
        </NextLink>
        <NextLink href={`/${slug}/analytics`} passHref>
          <Card className="w-full space-y-2 p-4 shadow transition-all hover:shadow-lg dark:hover:border-zinc-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm">Scans</p>
                <Badge className="h-[18px] px-2 text-[11px]" variant="neutral">
                  0%
                </Badge>
              </div>
              <ScanQrCode size={15} className="text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-bold">508,342</p>
              <p className="text-xs text-muted-foreground">50,450 previous period</p>
            </div>
          </Card>
        </NextLink>
      </div>
    </>
  );
};
