import { HTMLAttributes } from "react";

type ProgressPercentTabProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  count: number;
  percent: number;
};

export const ProgressPercentTab = ({
  label,
  count,
  percent,
  ...props
}: ProgressPercentTabProps) => {
  return (
    <div
      className="group relative px-3 transition-colors hover:bg-accent/40"
      role="button"
      {...props}
    >
      <div className="relative py-1.5">
        <div className="relative z-10 flex items-center justify-between space-x-3 px-3">
          <p className="min-w-0 truncate text-[13px]">{label}</p>
          <p className="text-[13px] tabular-nums">{percent.toFixed(2)}%</p>
        </div>
        <span
          className="absolute top-0.5 z-0 h-[calc(100%-4px)] rounded-md bg-accent dark:bg-accent/60"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-primary transition-all ease-in group-hover:h-[31.5px]" />
    </div>
  );
};
