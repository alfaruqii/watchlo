import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonMangaShelf({ count = 7 }: { count?: number }) {
  return (
    <section className="overflow-hidden pt-6 pb-2 sm:px-6 lg:px-10">
      {/* Shelf Header */}
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

      {/* Horizontal Cards Shelf (1:1 with MangaContainerCard & MangaCard) */}
      <div className="relative flex w-full gap-4 overflow-x-hidden pb-3 pt-1">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex w-[164px] shrink-0 sm:w-[228px] flex-col rounded-sm border border-hairline bg-surface-1 p-2.5"
          >
            {/* Top Collector Spine Strip */}
            <div className="mb-1.5 flex items-center justify-between border-b border-hairline/80 pb-1">
              <Skeleton className="h-2.5 w-14" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-8" />
                <Skeleton className="h-3 w-10 rounded-xs" />
              </div>
            </div>

            {/* Poster Frame (Aspect 2/3) */}
            <Skeleton className="mb-2 w-full aspect-[2/3] rounded-sm bg-surface-2" />

            {/* Title & SmallInfo Ledger */}
            <div className="flex w-full flex-col gap-1.5">
              <Skeleton className="h-4 w-4/5" />
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
