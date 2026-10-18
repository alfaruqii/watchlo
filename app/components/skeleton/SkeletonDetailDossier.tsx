import { Skeleton } from "@/components/ui/skeleton";
import SkeletonMangaShelf from "./SkeletonMangaShelf";

interface SkeletonDetailDossierProps {
  type?: "manga" | "anime" | "cinema";
}

export default function SkeletonDetailDossier({
  type = "anime",
}: SkeletonDetailDossierProps) {
  return (
    <div className="pb-12">
      {/* 1. Backdrop Banner Skeleton (Exact match: h-52 sm:h-64 lg:h-80) */}
      <div className="obi-frame-corners relative flex h-52 w-full overflow-hidden border-b border-hairline bg-surface-1 sm:h-64 lg:h-80">
        <div className="absolute inset-0 bg-surface-2/60 animate-pulse" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/65 to-[#0d0c0a]/30"
        />
        <div className="relative z-20 flex w-full items-start justify-end px-4 py-3 sm:mt-auto sm:items-center sm:px-6 lg:px-10">
          <Skeleton className="h-5 w-32 rounded-sm bg-surface-3 sm:h-6 sm:w-36" />
        </div>
      </div>

      {/* 2. Overlapping CardBanner Area (Exact match: -mt-16 sm:-mt-28) */}
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="relative z-20 -mt-16 mb-6 flex flex-row items-end gap-3.5 sm:-mt-28 sm:gap-6">
          {/* Collector Sleeve Poster Plate */}
          <div className="w-fit shrink-0 rounded-sm border border-hairline bg-surface-1 p-1.5 shadow-sleeve sm:p-2">
            <div className="mb-1 flex items-center justify-between gap-1 border-b border-hairline pb-1 font-mono text-[9px] sm:mb-1.5 sm:text-[10px]">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-2.5 w-6" />
            </div>
            <div className="relative h-36 w-24 overflow-hidden rounded-sm bg-surface-2 sm:h-48 sm:w-36 lg:h-56 lg:w-40">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
          </div>

          {/* Heading & Badges */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 pb-0.5 sm:gap-2.5 sm:pb-1">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-6 w-4/5 max-w-md sm:h-8 sm:w-3/4 lg:h-10" />
              <Skeleton className="h-4 w-1/2 max-w-xs sm:h-5" />
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1">
              <Skeleton className="h-5 w-16 rounded-sm" />
              <Skeleton className="h-5 w-20 rounded-sm" />
              <Skeleton className="h-5 w-14 rounded-sm" />
            </div>
          </div>
        </div>

        {/* 3. Archival Specifications & Liner Notes (12 Columns: 5 cols Specs + 7 cols Synopsis) */}
        <section className="my-6 grid grid-cols-1 gap-6 rounded-sm border border-hairline bg-surface-1 p-5 sm:p-7 lg:grid-cols-12">
          {/* Left Column: Specifications (5 cols) */}
          <div className="flex flex-col lg:col-span-5 lg:border-r lg:border-hairline lg:pr-7">
            <div className="mb-3 flex items-center gap-2 border-b border-hairline pb-2.5">
              <Skeleton className="size-4 shrink-0 rounded-xs" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex flex-col divide-y divide-hairline/40">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Liner Notes / Synopsis (7 cols) */}
          <div className="flex flex-col lg:col-span-7 lg:pl-2">
            <div className="mb-3 flex items-center gap-2 border-b border-hairline pb-2.5">
              <Skeleton className="size-4 shrink-0 rounded-xs" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>
        </section>

        {/* 4. Type-Specific Section: Chapter Rack / Episode Grid / Watch Actions */}
        {type === "manga" ? (
          /* Manga Chapter Rack Skeleton */
          <section className="my-8 rounded-sm border border-hairline bg-surface-1 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-5 shrink-0 rounded-xs" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-2.5 w-28" />
                </div>
              </div>
              <Skeleton className="h-7 w-28 rounded-sm" />
            </div>

            {/* Language & Filter Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-7 w-20 rounded-sm" />
                <Skeleton className="h-7 w-24 rounded-sm" />
                <Skeleton className="h-7 w-24 rounded-sm" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-32 rounded-sm" />
                <Skeleton className="h-7 w-20 rounded-sm" />
              </div>
            </div>

            {/* Chapter Tiles Grid */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-sm border border-hairline bg-surface-2/60 p-2.5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-2.5 w-8" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <div className="mt-2 flex items-center justify-between border-t border-hairline/40 pt-1">
                    <Skeleton className="h-2 w-14" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : type === "anime" ? (
          /* Anime Episode Reels Grid Skeleton */
          <section className="my-8 rounded-sm border border-hairline bg-surface-1 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 shrink-0 rounded-xs" />
                <Skeleton className="h-5 w-44" />
              </div>
              <Skeleton className="h-5 w-24 rounded-sm" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-sm border border-hairline bg-surface-2"
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
          </section>
        ) : (
          /* Cinema Screening Action Button */
          <div className="my-6 flex items-center gap-3">
            <Skeleton className="h-11 w-36 rounded-sm" />
            <Skeleton className="h-11 w-32 rounded-sm" />
          </div>
        )}
      </div>

      {/* 5. Curated Recommendations Shelf Skeleton */}
      <div className="mt-4 px-4 sm:px-0">
        <SkeletonMangaShelf count={7} />
      </div>
    </div>
  );
}
