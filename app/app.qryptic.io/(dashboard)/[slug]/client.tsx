"use client";

import { useState } from "react";
import { subDays, startOfToday } from "date-fns";
import { DateRange } from "react-day-picker";
import { useDashboard } from "@/lib/hooks/swr/use-dashboard";
import { Metrics } from "./metrics";
import { DateFilter } from "@/app/app.qryptic.io/(dashboard)/[slug]/date-filter";
import { TimeFrame } from "@/types/analytics";
import { EventChart } from "@/app/app.qryptic.io/(dashboard)/[slug]/event-chart";
import { Performers } from "@/app/app.qryptic.io/(dashboard)/[slug]/performers";

export const HomeClient = () => {
  const today = startOfToday();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("fourWeeks");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(today, 27), // 4 weeks by default
    to: today,
  });

  const { data, error, isLoading } = useDashboard(date?.from as Date, date?.to as Date, timeFrame);

  return (
    <>
      {error ? (
        <div>An error occured</div>
      ) : (
        <>
          <DateFilter
            timeFrame={timeFrame}
            date={date}
            setTimeFrame={setTimeFrame}
            setDate={setDate}
          />
          <Metrics isLoading={isLoading} data={data} />
          <div className="mt-5 grid grid-cols-5 gap-5">
            <EventChart data={data} isLoading={isLoading} date={date} timeFrame={timeFrame} />
            <Performers isLoading={isLoading} data={data} />
          </div>
        </>
      )}
    </>
  );
};
