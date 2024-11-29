import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { differenceInDays, format, startOfToday, subDays, subHours } from "date-fns";
import { daysMap } from "@/lib/analytics/maps";
import { toast } from "sonner";
import { TimeFrame } from "@/types/analytics";
import { useTeam } from "@/lib/hooks/swr/use-team";

type Props = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  tempDate: DateRange | undefined;
  setTempDate: (date: DateRange | undefined) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
};

export const DatePicker = ({
  date,
  setDate,
  tempDate,
  setTempDate,
  timeFrame,
  setTimeFrame,
}: Props) => {
  const { team } = useTeam();
  const today = startOfToday();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = () => {
    // check if the date range is invalid
    const isInvalidDate = !tempDate || !tempDate.from || !tempDate.to;
    if (isInvalidDate) {
      return setTempDate({
        from: timeFrame === "today" ? subHours(today, 23) : subDays(today, daysMap[timeFrame]),
        to: today,
      });
    }

    // check if the date range can be selected (based off plan)
    // get from date and check how many days in the past it is and compare to the plan max days
    const fromDate = tempDate?.from;
    // subtract from date from today to get the number of days
    const days = differenceInDays(today, fromDate as Date) + 1;
    // check if the days is greater than the plan max days
    if (days > (team?.plan?.analytics || 0)) {
      // if it is greater, set date back to the previous date range ( timeframe )
      setDate({
        from: timeFrame === "today" ? subHours(today, 23) : subDays(today, daysMap[timeFrame]),
        to: today,
      });
      setTempDate({
        from: timeFrame === "today" ? subHours(today, 23) : subDays(today, daysMap[timeFrame]),
        to: today,
      });
      // show a toast message
      return toast.error(`Date range exceeded!`, {
        description: `The date range selected is greater than the allowed range of ${team?.plan?.isFree ? team?.plan?.analytics : team ? team?.plan?.analytics - 1 : ""} days. Upgrade your plan to increase historical data.`,
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
    <div>
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
  );
};
