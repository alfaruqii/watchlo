import { Skeleton } from "@/components/ui/skeleton";

function SkeletonHeroBanner() {
  return (
    <section
      aria-label="Loading featured collector editions"
      className="w-full border-b border-hairline bg-surface-1/60 px-4 py-5 sm:px-6 lg:px-10 lg:py-8"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Main Screening Showcase Skeleton (9 cols on lg+, full width on mobile/tablet) */}
        <div className="relative overflow-hidden rounded-sm border border-hairline bg-surface-1 lg:col-span-9">
          <div className="grid min-h-[380px] w-full grid-cols-1 sm:min-h-[440px] md:grid-cols-12 lg:min-h-[480px]">
            {/* Vertical Criterion Spine OBI Strip (Left 2 cols on md+) */}
            <div className="relative z-20 hidden flex-col justify-between border-r border-hairline bg-surface-1 p-4 md:col-span-2 md:flex">
              <div className="flex flex-col gap-2 border-b border-hairline pb-3">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>

              <div className="my-auto flex flex-col gap-3 py-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-2 w-14" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-2 w-14" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-2 w-14" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              </div>

              <div className="border-t border-hairline pt-3">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Main Stage Projection Area (10 cols on md+, full width on mobile) */}
            <div className="relative flex flex-col justify-end p-5 sm:p-8 md:col-span-10 lg:p-10">
              <div className="flex max-w-2xl flex-col gap-3">
                {/* Format & Spine Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-sm" />
                  <Skeleton className="h-5 w-14 rounded-sm" />
                  <Skeleton className="h-5 w-16 rounded-sm" />
                </div>

                {/* Title Skeletons (fluid responsive widths) */}
                <div className="flex flex-col gap-2 pt-1">
                  <Skeleton className="h-7 w-4/5 sm:h-9 md:h-11" />
                  <Skeleton className="h-7 w-1/2 sm:h-9 md:h-11" />
                </div>

                {/* Synopsis Skeletons */}
                <div className="mt-1 flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-full max-w-xl" />
                  <Skeleton className="h-3.5 w-5/6 max-w-lg" />
                  <Skeleton className="h-3.5 w-2/3 max-w-md" />
                </div>

                {/* Watch Action Button Skeleton */}
                <div className="mt-3 flex items-center gap-3">
                  <Skeleton className="h-10 w-32 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edition Reel Sidebar Skeleton (3 cols on lg+, hidden on mobile/tablet) */}
        <div className="hidden flex-col justify-between overflow-hidden rounded-sm border border-hairline bg-surface-1 p-4 lg:col-span-3 lg:flex">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-14" />
          </div>

          <div className="flex flex-col gap-2 py-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-sm border border-hairline/60 bg-surface-2 p-2"
                >
                  <Skeleton className="h-3 w-6 shrink-0" />
                  <Skeleton className="h-10 w-8 shrink-0 rounded-sm" />
                  <div className="flex flex-1 flex-col gap-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t border-hairline pt-3">
            <Skeleton className="h-2.5 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkeletonHeroBanner;
