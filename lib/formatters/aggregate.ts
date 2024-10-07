import { differenceInDays, format, eachDayOfInterval, eachHourOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";

type Event = { createdAt: Date; type: "click" | "scan" };

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

export const aggregateEvents = (date: DateRange, events: Event[] = []): AggregatedData => {
  const { intervals, key } = getIntervals(date);

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
