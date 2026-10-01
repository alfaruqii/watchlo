import SkeletonDossierCard from "@/components/skeleton/SkeletonDossierCard";
import SkeletonEpisodeNum from "@/components/skeleton/SkeletonEpisodeNum";
import SkeletonMediaPlayer from "@/components/skeleton/SkeletonMediaPlayer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      {/* 1. Archival Broadcast Breadcrumb Bar Skeleton (Matches WatchPage header 1:1) */}
      <header className="flex items-center justify-between gap-2 rounded-sm border border-hairline bg-surface-1 px-3 py-2.5 sm:px-4 sm:py-3 shadow-xs">
        {/* Left: Breadcrumbs */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
          <Skeleton className="hidden h-3.5 w-14 sm:inline-block" />
          <span className="hidden text-muted-foreground/30 sm:inline">/</span>
          <Skeleton className="h-3.5 w-12" />
          <span className="text-muted-foreground/30">/</span>
          <Skeleton className="h-4 w-36 sm:w-56" />
          <Skeleton className="h-4 w-10 rounded-xs" />
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Skeleton className="hidden h-7 w-14 sm:inline-block rounded-sm" />
          <Skeleton className="hidden h-7 w-14 sm:inline-block rounded-sm" />
          <Skeleton className="h-7 w-20 rounded-sm" />
        </div>
      </header>

      {/* 2. Main Archival Screening Room Stage Skeleton */}
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Player + Dossier */}
        <section className="flex flex-col gap-6 lg:col-span-8">
          <SkeletonMediaPlayer />

          {/* Mobile Tab Control Skeleton (< lg only) */}
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="grid grid-cols-2 rounded-sm border border-hairline bg-surface-1 p-1">
              <Skeleton className="h-8 rounded-xs" />
              <Skeleton className="h-8 rounded-xs" />
            </div>
            <SkeletonEpisodeNum />
          </div>

          {/* Desktop Dossier Card Skeleton */}
          <div className="hidden lg:block">
            <SkeletonDossierCard />
          </div>
        </section>

        {/* Right Column: Physical Reel Rack Shelf (Desktop only) */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <SkeletonEpisodeNum />
          </div>
        </aside>
      </main>
    </div>
  );
}
