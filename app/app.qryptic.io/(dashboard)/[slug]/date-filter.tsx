import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CalendarDays, ChevronDown, Globe, Link2, Lock, Tag, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  differenceInDays,
  format,
  startOfMonth,
  startOfToday,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminRoles } from "@/utils/roles";
import NextLink from "next/link";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { useParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useState } from "react";
import { TimeFrame } from "@/types/analytics";

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

const timeFrameLabels = {
  today: "Today",
  sevenDays: "Last 7 days",
  fourWeeks: "Last 4 weeks",
  threeMonths: "Last 3 months",
  twelveMonths: "Last 12 months",
  threeYears: "Last 3 years",
  monthToDate: "Month to date",
  yearToDate: "Year to date",
  all: "All time",
  custom: "Custom",
};

type DateFilterProps = {
  setTimeFrame: (value: TimeFrame) => void;
  timeFrame: TimeFrame;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

export const DateFilter = ({ setTimeFrame, date, setDate, timeFrame }: DateFilterProps) => {
  const { team } = useTeam();
  const { slug } = useParams();
  const today = startOfToday();
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
        description: `The date range selected is greater than the allowed range of ${team?.plan.isFree ? team.plan.analytics : team.plan.analytics - 1} days. Upgrade your plan to increase historical data.`,
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
              <SelectTrigger className="h-8 space-x-2 min-[700px]:rounded-r-none">
                <span>{timeFrameLabels[timeFrame]}</span>
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
              onOpenChange={async (isOpen: boolean) => {
                setIsCalendarOpen(isOpen);
                if (!isOpen) await handleDateChange();
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={`space-x-2 rounded-l-none border-l-0 active:!scale-100 max-[700px]:hidden ${!tempDate && "text-muted-foreground"}`}
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
              <NextLink href={`/${slug}/links/new`} passHref>
                <DropdownMenuItem className="space-x-2">
                  <Link2 size={13} className="-rotate-45" />
                  <span className="text-[13px]">Link</span>
                </DropdownMenuItem>
              </NextLink>
              <NextLink href={`/${slug}/domains`} passHref>
                <DropdownMenuItem className="space-x-2">
                  <Globe size={13} />
                  <span className="text-[13px]">Domain</span>
                </DropdownMenuItem>
              </NextLink>
              <NextLink href={`/${slug}/tags`} passHref>
                <DropdownMenuItem className="space-x-2">
                  <Tag size={13} />
                  <span className="text-[13px]">Tag</span>
                </DropdownMenuItem>
              </NextLink>
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
    </>
  );
};
