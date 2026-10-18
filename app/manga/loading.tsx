import SkeletonHeroBanner from "@/components/skeleton/SkeletonHeroBanner";
import SkeletonMangaShelf from "@/components/skeleton/SkeletonMangaShelf";

export default function MangaLoading() {
  return (
    <div className="flex min-h-fit flex-col pb-8">
      <SkeletonHeroBanner />
      <div className="px-4 sm:px-0">
        <SkeletonMangaShelf count={7} />
      </div>
      <div className="px-4 sm:px-0">
        <SkeletonMangaShelf count={7} />
      </div>
      <div className="px-4 sm:px-0">
        <SkeletonMangaShelf count={7} />
      </div>
    </div>
  );
}
