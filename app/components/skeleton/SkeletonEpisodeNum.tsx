import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonEpisodeNum() {
  return (
    <aside className="flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sleeve">
      {/* Header */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-sm" />
      </div>

      {/* Jump Input Bar Skeleton */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-2/60 p-1">
          <Skeleton className="size-3.5 ml-1" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-7 w-12" />
        </div>
      </div>

      {/* Archival Arcs Range Tabs Skeleton */}
      <div className="mb-3 flex flex-col gap-1.5 border-b border-hairline pb-2.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-hidden pb-1">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 shrink-0 rounded-sm" />
            ))}
        </div>
      </div>

      {/* 5-Column Grid of Episode Buttons Skeleton (Matching AnimeReelRack) */}
      <div className="grid max-h-[380px] grid-cols-5 gap-1.5 overflow-y-hidden pr-1">
        {Array(25)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-sm" />
          ))}
      </div>

      {/* Footer Helper Line Skeleton */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-hairline pt-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    </aside>
  );
}
