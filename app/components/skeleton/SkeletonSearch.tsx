import { Skeleton } from "@/components/ui/skeleton";

function SkeletonSearch() {
  return (
    <div className="flex flex-col divide-y divide-hairline/60">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 p-3"
          >
            <div className="flex items-center gap-3">
              {/* 2:3 Archival Poster Thumbnail Skeleton */}
              <Skeleton className="h-20 w-14 shrink-0 rounded-sm" />

              {/* Result Meta & Title Skeletons */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-44 sm:w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            <Skeleton className="size-4 shrink-0 rounded-sm" />
          </div>
        ))}
    </div>
  );
}

export default SkeletonSearch;
