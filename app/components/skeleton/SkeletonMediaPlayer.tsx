import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface SkeletonMediaPlayerProps {
  className?: string;
}

export default function SkeletonMediaPlayer({
  className = "w-full flex flex-col gap-3",
}: SkeletonMediaPlayerProps) {
  return (
    <div className={className}>
      {/* 16:9 Viewfinder Projection Stage Skeleton (Exact 1:1 match with Media.tsx) */}
      <div className="obi-frame-corners relative aspect-video w-full overflow-hidden rounded-sm border border-hairline bg-[#0d0c0a] shadow-sleeve">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-1/40">
          <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2/90 px-3.5 py-1.5 font-mono text-xs text-muted-foreground shadow-sm">
            <Loader2 className="size-3.5 animate-spin text-gold" />
            <span className="tabular-nums">Memuat Proyeksi Reel...</span>
          </div>
        </div>
      </div>

      {/* Criterion Screening Deck Skeleton (Exact 1:1 responsive layout with AnimeScreeningDeck) */}
      <div className="flex flex-col gap-2.5 rounded-sm border border-hairline bg-surface-1 p-3 sm:gap-3 sm:p-4 shadow-sm">
        {/* Upper Control Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2.5">
          {/* Row 1 (Mobile) / Left (Desktop): Reel Nav */}
          <div className="flex w-full items-center justify-between gap-1.5 sm:w-auto sm:justify-start sm:gap-2">
            <Skeleton className="h-8 w-16 sm:w-20" />
            <Skeleton className="h-8 flex-1 sm:w-32 sm:flex-initial" />
            <Skeleton className="h-8 w-16 sm:w-20" />
          </div>

          {/* Row 2 (Mobile) / Center (Desktop): Quick Seeks */}
          <div className="grid w-full grid-cols-3 gap-1.5 sm:flex sm:w-auto sm:items-center">
            <Skeleton className="h-8 w-full sm:w-16" />
            <Skeleton className="h-8 w-full sm:w-16" />
            <Skeleton className="h-8 w-full sm:w-24" />
          </div>

          {/* Row 3 (Mobile) / Right (Desktop): Actions */}
          <div className="grid w-full grid-cols-4 gap-1.5 sm:flex sm:w-auto sm:items-center sm:gap-2">
            <Skeleton className="h-8 w-full sm:w-14" />
            <Skeleton className="h-8 w-full sm:w-20" />
            <Skeleton className="h-8 w-full sm:w-16" />
            <Skeleton className="h-8 w-full sm:w-24" />
          </div>
        </div>

        {/* Lower Status Footer Bar */}
        <div className="flex items-center justify-between border-t border-hairline pt-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-28 sm:w-56" />
        </div>
      </div>
    </div>
  );
}
