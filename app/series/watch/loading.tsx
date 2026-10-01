import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      {/* 1. Screening Room Breadcrumb Masthead Skeleton (1:1 with Series WatchPage) */}
      <header className="flex items-center justify-between gap-2 rounded-sm border border-hairline bg-surface-1 px-3 py-2.5 sm:px-4 sm:py-3 shadow-xs">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-xs sm:gap-2">
          <span className="text-muted-foreground/60">SERIES</span>
          <span className="text-muted-foreground/30">/</span>
          <Skeleton className="h-4 w-32 sm:w-56" />
          <Skeleton className="h-5 w-16 rounded-xs" />
        </div>

        <Skeleton className="h-7 w-28 rounded-sm" />
      </header>

      {/* 2. Responsive 5-Column Grid (3 cols Player Stage + 2 cols Episode Rack) */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5">
        {/* Screening Room Player Stage Skeleton (col-span-3) */}
        <section className="col-span-3 flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5">
          {/* Deck Header */}
          <div className="mb-3 flex flex-col gap-2.5 border-b border-hairline pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded-xs" />
              <Skeleton className="h-5 w-44" />
            </div>
            <Skeleton className="h-8 w-full rounded-sm sm:w-48" />
          </div>

          {/* 16:9 Aspect Video Stage */}
          <div className="obi-frame-corners relative aspect-video w-full overflow-hidden rounded-sm border border-hairline bg-[#0d0c0a]">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-1/40">
              <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2/90 px-3.5 py-1.5 font-mono text-xs text-muted-foreground shadow-sm">
                <Loader2 className="size-3.5 animate-spin text-gold" />
                <span className="tabular-nums">Memuat Proyeksi Reel...</span>
              </div>
            </div>
          </div>
        </section>

        {/* Physical Episode Reel Rack Shelf Skeleton (col-span-2) */}
        <aside className="col-span-2 flex flex-col rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5">
          {/* Header */}
          <div className="mb-3.5 flex items-center justify-between gap-2 border-b border-hairline pb-2.5">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded-xs" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>

          {/* 5-Column Grid of Episode Buttons */}
          <div className="grid max-h-96 grid-cols-5 gap-2 overflow-hidden pr-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5">
            {Array.from({ length: 25 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-sm" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
