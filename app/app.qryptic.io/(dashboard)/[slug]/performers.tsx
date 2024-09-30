"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PerformersProps = {
  isLoading: boolean;
  data: Record<string, any> | null;
};

export const Performers = ({ isLoading, data }: PerformersProps) => {
  return (
    <div className="col-span-2 h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Top performers</CardTitle>
          <CardDescription className="text-[13px]">
            Links with the most clicks and scans
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
