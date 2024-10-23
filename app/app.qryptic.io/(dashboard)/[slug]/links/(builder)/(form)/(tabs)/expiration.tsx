"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, ChevronDown } from "lucide-react";
import { format, startOfToday } from "date-fns";
import { useEffect, useState, useRef } from "react";

export const Expiration = () => {
  const { tab, expiredDestination, setExpiredDestination, expiresAt, setExpiresAt } = useLinkForm();
  // const [hours, setHours] = useState<number>(0);
  // const [minutes, setMinutes] = useState<number>(0);
  // const [amPm, setAmPm] = useState<"am" | "pm">("am");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // const selectedHourRef = useRef<HTMLDivElement>(null);
  // const selectedMinuteRef = useRef<HTMLDivElement>(null);

  // const resetTime = () => {
  //   setHours(0);
  //   setMinutes(0);
  //   setAmPm("am");
  // };

  // const scrollToSelected = () => {
  //   if (selectedMinuteRef.current) {
  //     selectedMinuteRef.current.scrollIntoView({ behavior: "auto", block: "start" });
  //   }
  //   if (selectedHourRef.current) {
  //     selectedHourRef.current.scrollIntoView({ behavior: "auto", block: "nearest" });
  //   }
  // };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     scrollToSelected();
  //   }, 100);
  //
  //   return () => clearTimeout(timer); // Cleanup the timeout
  // }, [isCalendarOpen]);

  return (
    <div className={cn("space-y-4", tab !== "expiration" && "hidden")}>
      <div className="space-y-1.5">
        <p className="text-[13px] font-medium">Expiration date</p>
        <div>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 w-full justify-between space-x-2 font-normal active:!scale-100",
                  !expiresAt && "text-muted-foreground",
                )}
              >
                <div className="flex items-center space-x-2">
                  <CalendarDays size={14} />
                  <span>
                    {expiresAt
                      ? `${format(expiresAt, "MMMM d, yyyy h:mm aa")}`
                      : "No expiration date set"}
                  </span>
                </div>
                <ChevronDown size={14} className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <div className="flex">
                <Calendar
                  mode="single"
                  onSelect={(date) => {
                    setExpiresAt(date);
                  }}
                  defaultMonth={expiresAt || startOfToday()}
                  selected={expiresAt}
                  disabled={(date) => date <= startOfToday()}
                  // className="border-r border-dashed"
                />
                {/*<div className="flex space-x-0.5 p-3">*/}
                {/*  <div className="h-[260px] overflow-y-auto scrollbar-hide">*/}
                {/*    {Array.from({ length: 12 }).map((_, i) => (*/}
                {/*      <div*/}
                {/*        ref={i === hours ? selectedHourRef : null}*/}
                {/*        role="button"*/}
                {/*        key={i}*/}
                {/*        className={cn(*/}
                {/*          "w-9 rounded-md py-1 transition-colors hover:bg-accent/90",*/}
                {/*          hours === i && "bg-primary text-primary-foreground hover:bg-primary",*/}
                {/*        )}*/}
                {/*        onClick={() => setHours(i)}*/}
                {/*      >*/}
                {/*        <p className="text-center text-[13px]">*/}
                {/*          {(i + 1).toString().padStart(2, "0")}*/}
                {/*        </p>*/}
                {/*      </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*  <div className="h-[260px] overflow-y-auto scrollbar-hide">*/}
                {/*    {Array.from({ length: 60 }).map((_, i) => (*/}
                {/*      <div*/}
                {/*        ref={i === minutes ? selectedMinuteRef : null}*/}
                {/*        role="button"*/}
                {/*        key={i}*/}
                {/*        className={cn(*/}
                {/*          "w-9 rounded-md py-1 transition-colors hover:bg-accent/90",*/}
                {/*          minutes === i && "bg-primary text-primary-foreground hover:bg-primary",*/}
                {/*        )}*/}
                {/*        onClick={() => setMinutes(i)}*/}
                {/*      >*/}
                {/*        <p className="text-center text-[13px]">{i.toString().padStart(2, "0")}</p>*/}
                {/*      </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*  <div>*/}
                {/*    {["am", "pm"].map((period) => (*/}
                {/*      <div*/}
                {/*        key={period}*/}
                {/*        className={cn(*/}
                {/*          "w-9 rounded-md py-1 transition-colors hover:bg-accent/90",*/}
                {/*          amPm === period && "bg-primary text-primary-foreground hover:bg-primary",*/}
                {/*        )}*/}
                {/*        role="button"*/}
                {/*        onClick={() => setAmPm(period as "am" | "pm")}*/}
                {/*      >*/}
                {/*        <p className="text-center text-[13px] uppercase">{period}</p>*/}
                {/*      </div>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="expired-destination">Expiration destination</Label>
        <Input
          id="expired-destination"
          placeholder="example.com (optional)"
          value={expiredDestination || ""}
          onChange={(e) => setExpiredDestination(e.target.value)}
        />
        <div className="flex space-x-1.5">
          <Info size={13} className="relative top-[1px] shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            The destination to redirect users to when the link expires.
          </p>
        </div>
      </div>
    </div>
  );
};
