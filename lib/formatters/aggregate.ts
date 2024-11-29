import {
  differenceInDays,
  format,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachHourOfInterval,
  isToday,
  subHours,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { TimeFrame } from "@/types/analytics";

type Event = { createdAt: Date; type: "click" | "scan" };

// Function to determine intervals dynamically based on the date range
const getIntervals = (date: DateRange) => {
  if (!date.from || !date.to) return { intervals: [], key: "" };

  const diffInDays = differenceInDays(date.to, date.from);

  if (diffInDays === 0) {
    // const isTodaysDate = isToday(date.from as Date);
    // const hours = eachHourOfInterval({
    //   start: date.from as Date,
    //   end: isTodaysDate ? new Date() : date.to.setHours(23, 59, 59, 999),
    // });
    // return { intervals: hours, key: "h a" };
    const last24HoursStart = subHours(new Date(), 23); // 24 hours ago
    const hours = eachHourOfInterval({
      start: last24HoursStart,
      end: new Date(),
    });
    return { intervals: hours, key: "h a" };
  }

  // Group by day for up to 9 months
  if (diffInDays <= 270) {
    const isTodaysDate = isToday(date.from);
    const days = eachDayOfInterval({
      start: date.from,
      end: isTodaysDate ? new Date() : date.to,
    });
    return { intervals: days, key: "MM-dd-yyyy" }; // Daily key
  }

  // // Group by week for up to 3 years
  // if (diffInYears < 3) {
  //   const weeks = eachWeekOfInterval({
  //     start: date.from,
  //     end: date.to,
  //   });
  //   return { intervals: weeks, key: "wo-yyyy" }; // Weekly key
  // }

  // Group by month for periods longer than 9 months
  const months = eachMonthOfInterval({
    start: date.from,
    end: date.to,
  });
  return { intervals: months, key: "yyyy-MM-01" }; // Monthly key
};

type AggregatedData = { interval: string; clicks: number; scans: number; total: number }[];

// Function to aggregate events based on intervals
export const aggregateEvents = (
  date: DateRange,
  events: Event[] = [],
  timeFrame?: TimeFrame,
): AggregatedData => {
  const { intervals, key } = getIntervals(date);
  console.log(intervals);

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
