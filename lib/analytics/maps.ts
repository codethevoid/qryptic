import { TimeFrame } from "@/types/analytics";
import { differenceInDays, startOfMonth, startOfToday, startOfYear, subMonths } from "date-fns";

export const timeFrameLabels = {
  today: "Today",
  twentyFourHours: "Last 24 hours",
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

export const daysMap: Record<TimeFrame, number> = {
  today: 0,
  twentyFourHours: 1,
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
