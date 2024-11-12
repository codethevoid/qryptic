import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { TimeFrame } from "@/types/analytics";
import { daysMap, timeFrameLabels } from "@/lib/analytics/maps";
import { startOfToday, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Lock } from "lucide-react";

type Props = {
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  setDate: (date: DateRange | undefined) => void;
  setTempDate: (date: DateRange | undefined) => void;
};

export const TimeframePicker = ({ timeFrame, setTimeFrame, setDate, setTempDate }: Props) => {
  const today = startOfToday();
  const { team } = useTeam();

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

  return (
    <div>
      <Select value={timeFrame} onValueChange={(value: TimeFrame) => handleTimeFrameChange(value)}>
        <SelectTrigger className="h-8 space-x-2 min-[700px]:rounded-r-none">
          <span>{timeFrameLabels[timeFrame]}</span>
        </SelectTrigger>
        <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
          <SelectGroup>
            {timeFrame === "custom" && <SelectItem value="custom">Custom</SelectItem>}
            <SelectItem value="today">Today</SelectItem>
            {/*<SelectItem value="twentyFourHours">Last 24 hours</SelectItem>*/}
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
            {(team?.plan?.analytics || 0) >= 1096 && (
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
            {(team?.plan?.analytics || 0) < 1096 && !team?.plan?.isFree && (
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
    </div>
  );
};
