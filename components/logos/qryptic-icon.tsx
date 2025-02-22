import { cn } from "@/lib/utils";

type QrypticIconProps = {
  className?: string;
};

export const QrypticIcon = ({ className }: QrypticIconProps) => {
  return (
    <svg
      id="qryptic icon logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1932.6 1641.47"
      className={cn("h-4 fill-black dark:fill-white", className)}
    >
      <path d="M239.49,0h843.3c337.48,0,611.94,274.87,611.94,612.35v618.45h-239.49v-618.45c0-205.74-166.71-372.86-372.45-372.86h-372.45v.41H0v789.63c0,337.48,274.46,611.94,612.35,611.94h1320.25v-239.08H612.35c-205.74,0-372.86-167.12-372.86-372.86V0Z" />
    </svg>
  );
};
