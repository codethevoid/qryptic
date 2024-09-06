"use client";

import { useState, useEffect } from "react";
import { QrypticIcon } from "@/components/logos/qryptic-icon";

type SplashLoaderProps = {
  isLoading: boolean;
  minDuration?: number;
};

export const SplashLoader = ({ isLoading, minDuration = 1500 }: SplashLoaderProps) => {
  const [shouldShowLoader, setShouldShowLoader] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    // If loading finished (either success or error)
    if (!isLoading) {
      const loadTime = Date.now() - startTime; // Calculate how long it took to load

      // Ensure the loader is visible for at least 1 second (1000ms)
      const delay = Math.max(minDuration - loadTime, 0); // Calculate the remaining time

      const timeoutId = setTimeout(() => {
        setShouldShowLoader(false); // Hide the loader after the delay
      }, delay);

      // Clean up the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  if (!shouldShowLoader) return null;

  return (
    <div className="fixed left-0 top-0 z-[9999] flex h-screen w-full items-center justify-center bg-background">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
        <div className="absolute -z-10 h-11 w-11 animate-ping rounded-full bg-foreground/50"></div>
        <QrypticIcon className="z-10 fill-white dark:fill-black" />
      </div>
    </div>
  );
};
