import { cn } from "@/../lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm border border-hairline/50 bg-surface-2",
        className
      )}
    />
  );
}

export { Skeleton };
