"use client";

import { cn } from "@/lib/utils";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Protection = () => {
  const { tab, password, setPassword } = useLinkForm();

  return (
    <div className={cn("space-y-4", tab !== "protection" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </div>
  );
};
