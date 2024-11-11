"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartArea, MousePointer2, ScanQrCode } from "lucide-react";
import NextLink from "next/link";
import { DateRange } from "react-day-picker";
import { MiniChart } from "@/components/charts/mini-chart";
import { type Dashboard } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";
import { useParams } from "next/navigation";
import { LinkFavicon } from "@/components/ui/custom/link-favicon";

type PerformersProps = {
  isLoading: boolean;
  data: Dashboard | undefined;
  date: DateRange | undefined;
};

export const Performers: FC<PerformersProps> = ({ data, date, isLoading }) => {
  const { slug } = useParams();

  return (
    <div className="max-[800px]:col-span-5 min-[800px]:col-span-2">
      <Card className="overflow-hidden">
        <CardHeader className="border-b p-4">
          <CardTitle>Top performers</CardTitle>
          <CardDescription className="text-[13px]">Most active links this period</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <PerformersSkeleton />
          ) : data?.topLinks.length === 0 ? (
            <Empty />
          ) : (
            <div>
              {data?.topLinks.map((link: any, i: number) => (
                <div
                  key={link.id}
                  className={`w-full ${i !== data?.topLinks.length - 1 ? "border-b" : undefined} cursor-pointer transition-colors hover:bg-accent/60 dark:hover:bg-accent/40`}
                >
                  <NextLink
                    href={`/${slug}/links/edit/${link.id}`}
                    className="flex items-center justify-between space-x-3 px-4 py-2.5"
                  >
                    <div className="flex min-w-0 items-center space-x-2.5">
                      {/*<div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">*/}
                      {/*  {countEvents(link.events) === "clicks" ? (*/}
                      {/*    <MousePointer2 size={13} />*/}
                      {/*  ) : (*/}
                      {/*    <ScanQrCode size={13} />*/}
                      {/*  )}*/}
                      {/*</div>*/}
                      <LinkFavicon link={{ destination: link.destination, events: link.events }} />
                      <div className="min-w-0 space-y-0.5">
                        <p className="truncate text-[13px]">
                          {link.domain.name}/{link.slug}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          +{link.events.length.toLocaleString("en-us")} event
                          {link.events.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <MiniChart events={link.events} date={date} />
                  </NextLink>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Empty: FC = () => {
  return (
    <div className="h-[175.5px] px-6">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
          <ChartArea size={15} />
        </div>
        <div className="space-y-0.5">
          <p className="text-center text-[13px] font-medium">No activity found</p>
          <p className="text-center text-xs text-muted-foreground">
            There are no events for this period
          </p>
        </div>
      </div>
    </div>
  );
};

const PerformersSkeleton: FC = () => {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={i !== 5 ? "border-b" : undefined}>
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center space-x-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-0.5">
                <div className="flex h-[19.5px] items-center">
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex h-4 items-center">
                  <Skeleton className="h-3.5 w-20" />
                </div>
              </div>
            </div>
            {/*<MiniChart events={link.events} date={date} />*/}
            <Skeleton className="h-8 w-20"></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
};

{
  /*<Avatar className="h-8 w-8 border">*/
}
{
  /*  <AvatarImage*/
}
{
  /*    src={`https://www.google.com/s2/favicons?sz=64&domain_url=${link.destination}`}*/
}
{
  /*    alt="favicon"*/
}
{
  /*    className="rounded-full p-[3px]"*/
}
{
  /*  />*/
}
{
  /*  <AvatarFallback className="bg-transparent">*/
}
{
  /*    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">*/
}
{
  /*      <Link2 size={13} />*/
}
{
  /*    </div>*/
}
{
  /*    <Skeleton className="h-full w-full" />*/
}
{
  /*  </AvatarFallback>*/
}
{
  /*</Avatar>*/
}
