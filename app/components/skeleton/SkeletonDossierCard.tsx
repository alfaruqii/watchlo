import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDossierCard() {
  return (
    <aside className="flex flex-col gap-4 rounded-sm border border-hairline bg-surface-1 p-5 sm:p-6 shadow-sleeve">
      {/* Dossier Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16 rounded-xs" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-24 rounded-sm" />
          <Skeleton className="h-7 w-24 rounded-sm" />
        </div>
      </div>

      {/* Main Content Area: Side-by-side Poster Sleeve & Specs */}
      <div className="flex flex-row items-start gap-3.5 sm:gap-6">
        {/* Physical Sleeve Cover Skeleton */}
        <div className="relative w-24 shrink-0 sm:w-32 md:w-36">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xs border border-hairline bg-surface-2 shadow-md">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <Skeleton className="mt-2 h-6 w-full rounded-xs" />
        </div>

        {/* Text & Specification Ledger Skeleton */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3.5">
          {/* Title Block */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-3/4 max-w-sm sm:h-7" />
            <Skeleton className="h-3 w-1/2 max-w-xs" />
          </div>

          {/* Key Specifications Grid */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Skeleton className="h-5 w-20 rounded-xs" />
            <Skeleton className="h-5 w-20 rounded-xs" />
            <Skeleton className="h-5 w-16 rounded-xs" />
            <Skeleton className="h-5 w-14 rounded-xs" />
          </div>

          {/* Quick Action Button Ledger */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Skeleton className="h-8 w-full sm:w-28 rounded-xs" />
            <Skeleton className="h-8 w-full sm:w-28 rounded-xs" />
          </div>

          {/* Liner Notes Synopsis Block */}
          <div className="mt-1 flex flex-col gap-1.5 border-t border-hairline/60 pt-2.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </aside>
  );
}
