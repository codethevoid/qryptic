"use client";

import { Button } from "@/components/ui/button";
import { Sun, MoonStar } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();
  return (
    <div className="relative flex h-7 w-[56px] items-center rounded-full border bg-background">
      <Button
        name="theme-toggle-light"
        size="icon"
        className="absolute left-[-1px] h-7 w-7 shrink-0 rounded-full border bg-transparent text-foreground shadow-none hover:bg-transparent dark:border-transparent dark:text-muted-foreground dark:hover:text-foreground"
        onClick={() => setTheme("light")}
      >
        <Sun size={14} />
      </Button>

      <Button
        name="theme-toggle-dark"
        size="icon"
        className="absolute right-[-1px] h-7 w-7 shrink-0 rounded-full border border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground dark:border-border dark:text-foreground"
        onClick={() => setTheme("dark")}
      >
        <MoonStar size={14} />
      </Button>
    </div>
  );
};
