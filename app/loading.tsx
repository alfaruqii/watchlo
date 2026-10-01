import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";
import SkeletonHeroBanner from "@/components/skeleton/SkeletonHeroBanner";
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="flex min-h-fit flex-col pb-8">
      {/* Hero Screening Stage Skeleton */}
      <SkeletonHeroBanner />

      {/* Critics' Vault — Top Rated Films Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>

      {/* Current Screening — Trending Films Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>

      {/* Archival Curator Spotlight Intermission Skeleton */}
      <section
        aria-label="Archival Curator Spotlight Skeleton"
        className="mx-4 my-8 overflow-hidden rounded-sm border border-hairline bg-surface-1 sm:mx-6 lg:mx-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="flex flex-col justify-between border-b border-hairline p-4 sm:p-6 md:col-span-6 md:border-b-0 md:border-r lg:p-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-7 w-3/4 sm:h-9" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28 rounded-sm" />
                <Skeleton className="h-5 w-20 rounded-sm" />
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Skeleton className="h-10 w-36 rounded-sm" />
            </div>
          </div>
          <div className="relative min-h-[220px] bg-surface-2 p-6 md:col-span-6 md:min-h-full">
            <Skeleton className="h-full w-full rounded-sm" />
          </div>
        </div>
      </section>

      {/* Serialized Television Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>

      {/* Archival Repertory Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>
    </div>
  );
}

export default Loading;
