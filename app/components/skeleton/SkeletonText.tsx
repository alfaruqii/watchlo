import { Skeleton } from "@/components/ui/skeleton";

function SkeletonText() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-10">
      {/* 12-Column Dossier Split Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
        {/* Left Column (Poster Sleeve + Spec Table) */}
        <div className="flex flex-col gap-4 md:col-span-4 lg:col-span-3">
          <div className="overflow-hidden rounded-sm border border-hairline bg-surface-1 shadow-sleeve">
            <Skeleton className="aspect-[2/3] w-full rounded-none" />
            <div className="border-t border-hairline p-3">
              <Skeleton className="h-3 w-28" />
            </div>
          </div>

          {/* Quick Technical Specs Ledger */}
          <div className="rounded-sm border border-hairline bg-surface-1 p-3">
            <div className="flex flex-col divide-y divide-hairline">
              <div className="flex justify-between py-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex justify-between py-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex justify-between py-2">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Header Dossier + Synopsis + Genre Chips) */}
        <div className="flex flex-col justify-between gap-6 md:col-span-8 lg:col-span-9">
          <div className="flex flex-col gap-4">
            {/* Top Catalog & Rating Row */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-16" />
            </div>

            {/* Display Title Skeleton */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-3/4 sm:h-12" />
              <Skeleton className="h-9 w-1/2 sm:h-12" />
            </div>

            {/* Synopsis Paragraph Skeleton */}
            <div className="mt-2 flex max-w-3xl flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Genre Chips Skeleton */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-sm" />
              <Skeleton className="h-6 w-24 rounded-sm" />
              <Skeleton className="h-6 w-16 rounded-sm" />
              <Skeleton className="h-6 w-28 rounded-sm" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-4 border-t border-hairline">
            <Skeleton className="h-11 w-36 rounded-sm" />
            <Skeleton className="h-11 w-32 rounded-sm" />
          </div>
        </div>
      </div>

      {/* 4-Column Archival Ledger Grid Skeleton below */}
      <div className="my-8 rounded-sm border border-hairline bg-surface-1 p-5">
        <div className="mb-4 border-b border-hairline pb-2.5">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonText;
