import { differenceInDays, format, eachDayOfInterval, eachHourOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";

// function that will return an interval key based on the time frame
const getIntervals = (date: DateRange) => {
  const diffInDays = differenceInDays(date.to as Date, date.from as Date);
  // const diffInMonths = differenceInMonths(date.to as Date, date.from as Date);
  // group hourly for one day
  if (diffInDays === 0) {
    const hours = eachHourOfInterval({ start: date.from as Date, end: new Date() });
    return { intervals: hours, key: "h a" };
  }
  // group everything else by day
  const days = eachDayOfInterval({ start: date.from as Date, end: date.to as Date });
  return { intervals: days, key: "MM-dd-yyyy" };
};

type AggregatedData = { interval: string; clicks: number; scans: number }[];

export const aggregateEvents = (
  date: DateRange,
  events: Record<string, any>[] = [],
): AggregatedData => {
  const { intervals, key } = getIntervals(date);

  const formattedData: AggregatedData = intervals.map((interval) => {
    const intervalKey = format(interval, key);

    const eventsForInterval = events.filter((e) => {
      const eventKey = format(e.createdAt, key);
      return eventKey === intervalKey;
    });

    let clicks = 0;
    let scans = 0;
    for (const event of eventsForInterval) {
      if (event.type === "click") clicks++;
      if (event.type === "scan") scans++;
    }

    return { interval: intervalKey, clicks, scans };
  });
  return Object.values(formattedData);
};
