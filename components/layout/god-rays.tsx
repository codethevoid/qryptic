"use client";

import { usePathname } from "next/navigation";

export const GodRays = () => {
  const path = usePathname();

  if (path.includes("/blog")) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="jumbo absolute -inset-[10px] opacity-50"></div>
    </div>
  );
};
