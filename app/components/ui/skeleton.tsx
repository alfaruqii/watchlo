import { cn } from "@/../lib/utils";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-300/40", className)} />;
}

export { Skeleton };
