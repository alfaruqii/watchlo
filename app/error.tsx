"use client";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function Error({ reset }: { reset?: () => void }) {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-sm border border-hairline bg-surface-1 p-6 text-center shadow-sleeve">
        <div className="relative size-36 overflow-hidden rounded-sm border border-hairline bg-surface-2">
          <Image
            unoptimized
            src="/fallback-card.webp"
            alt="Archival reel error"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <AlertTriangle className="size-5 text-vermilion" strokeWidth={1.75} />
          <span>Projection Interrupted</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Unable to load this archival reel right now. You can retry the request
          or return to the main catalog index.
        </p>
        <div className="flex items-center gap-3 pt-1">
          {reset && (
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="size-3.5" strokeWidth={1.75} />
              <span>Retry</span>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/">Return to Catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Error;
