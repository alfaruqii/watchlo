import { Skeleton } from "@/components/ui/skeleton";

function SkeletonEpisodes({ noMargin = false }: { noMargin?: boolean } = {}) {
  if (noMargin) {
    // Episode Reels skeleton (used inside detail views / EpisodesContainer)
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-sm border border-hairline bg-surface-1"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="flex flex-col gap-1.5 p-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Full Catalog Rail Carousel Skeleton (matching MoviesContainerCard and AnimeContainerCard)
  return (
    <section className="overflow-hidden pt-6 pb-2 sm:px-6 lg:px-10">
      {/* Section Header Ledger */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded-xs" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-44 sm:h-6 sm:w-64" />
            <Skeleton className="h-2.5 w-28 sm:w-36" />
          </div>
        </div>
        <Skeleton className="h-3 w-16 shrink-0 sm:w-20" />
      </div>

      {/* Horizontal Card Carousel */}
      <div className="relative flex w-full gap-4 overflow-x-hidden pb-3 pt-1">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 flex-col rounded-sm border border-hairline bg-surface-1 p-2.5"
            >
              {/* Top Collector Spine Strip */}
              <div className="mb-1.5 flex items-center justify-between border-b border-hairline/80 pb-1">
                <Skeleton className="h-2.5 w-14" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-2.5 w-8" />
                  <Skeleton className="h-3 w-10 rounded-xs" />
                </div>
              </div>

              {/* Poster Frame (Exact match: h-48 w-36 sm:h-72 sm:w-52) */}
              <Skeleton className="mb-2 h-48 w-36 rounded-sm bg-surface-2 sm:h-72 sm:w-52" />

              {/* Title & Metadata */}
              <div className="flex w-36 flex-col gap-1.5 sm:w-52">
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-1 flex items-center justify-between border-t border-hairline/70 pt-1.5">
                  <Skeleton className="h-2.5 w-14" />
                  <Skeleton className="h-3 w-8 rounded-xs" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default SkeletonEpisodes;
