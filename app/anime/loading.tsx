import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";
import SkeletonHeroBanner from "@/components/skeleton/SkeletonHeroBanner";

function Loading() {
  return (
    <div className="flex min-h-fit flex-col pb-8">
      {/* Hero Anime Stage Skeleton */}
      <SkeletonHeroBanner />

      {/* Simulcast Desk — Recently Updated Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>

      {/* Essential Catalog — Most Popular Anime Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>

      {/* Seasonal Index — Trending Now Skeleton */}
      <div className="px-4 sm:px-0">
        <SkeletonEpisodes />
      </div>
    </div>
  );
}

export default Loading;
