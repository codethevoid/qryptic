import { differenceInDays, format, eachDayOfInterval, eachHourOfInterval, isToday } from "date-fns";
import { DateRange } from "react-day-picker";
import { TimeFrame } from "@/types/analytics";

type Event = { createdAt: Date; type: "click" | "scan" };

// function that will return an interval key based on the time frame
const getIntervals = (date: DateRange, timeFrame?: TimeFrame) => {
  if (!date.from || !date.to) return { intervals: [], key: "" };
  const diffInDays = differenceInDays(date.to as Date, date.from as Date);
  // const diffInMonths = differenceInMonths(date.to as Date, date.from as Date);
  // group hourly for one day
  // if the day is in the past, we want to show all hours

  if (diffInDays === 0) {
    const isTodaysDate = isToday(date.from as Date);
    const hours = eachHourOfInterval({
      start: date.from as Date,
      end: isTodaysDate ? new Date() : date.to.setHours(23, 59, 59, 999),
    });
    return { intervals: hours, key: "h a" };
  }
  // group everything else by day
  const days = eachDayOfInterval({ start: date.from as Date, end: date.to as Date });
  return { intervals: days, key: "MM-dd-yyyy" };
};

type AggregatedData = { interval: string; clicks: number; scans: number }[];

export const aggregateEvents = (
  date: DateRange,
  events: Event[] = [],
  timeFrame?: TimeFrame,
): AggregatedData => {
  const { intervals, key } = getIntervals(date, timeFrame);

  const formattedData: AggregatedData = intervals.map((interval) => {
    const intervalKey = format(interval, key);

    const eventsForInterval = events.filter((e) => {
      const eventKey = format(e.createdAt, key);
      return eventKey === intervalKey;
    });

    let clicks = 0;
    let scans = 0;
    let total = 0;
    for (const event of eventsForInterval) {
      if (event.type === "click") clicks++;
      if (event.type === "scan") scans++;
      total++;
    }

    return { interval: intervalKey, clicks, scans, total };
  });

  return Object.values(formattedData);
};
