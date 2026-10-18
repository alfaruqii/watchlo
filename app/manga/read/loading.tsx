import { Skeleton } from "@/components/ui/skeleton";

export default function MangaReadLoading() {
  return (
    <div className="min-h-screen bg-[#070605] text-[#f2ece1]">
      {/* Header bar skeleton */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-[#262420] bg-[#0d0c0a] px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-20 rounded-sm bg-[#1c1a15]" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-36 bg-[#1c1a15]" />
            <Skeleton className="h-2.5 w-20 bg-[#1c1a15]" />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Skeleton className="h-7 w-32 rounded-sm bg-[#1c1a15]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-16 rounded-sm bg-[#1c1a15]" />
          <Skeleton className="h-7 w-7 rounded-sm bg-[#1c1a15]" />
        </div>
      </div>

      {/* Main strip skeleton */}
      <div className="mx-auto flex max-w-[780px] flex-col items-center gap-4 py-6 px-3">
        <div className="relative aspect-[2/3] w-full max-w-[650px] overflow-hidden rounded-sm border border-[#262420] bg-[#12100d] flex items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#a19c91] animate-pulse">
            RETRIEVING ARCHIVAL STRIP PAGES...
          </span>
        </div>
        <div className="relative aspect-[2/3] w-full max-w-[650px] overflow-hidden rounded-sm border border-[#262420] bg-[#12100d]/70 animate-pulse" />
        <div className="relative aspect-[2/3] w-full max-w-[650px] overflow-hidden rounded-sm border border-[#262420] bg-[#12100d]/40 animate-pulse" />
      </div>
    </div>
  );
}
