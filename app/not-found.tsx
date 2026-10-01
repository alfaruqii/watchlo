"use client";
import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-12">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-sm border border-hairline bg-surface-1 p-6 text-center shadow-sleeve">
        <div className="relative size-36 overflow-hidden rounded-sm border border-hairline bg-surface-2">
          <Image
            unoptimized
            src="/fallback-card.webp"
            alt="Missing archival edition"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Compass className="size-5 text-gold" strokeWidth={1.75} />
          <span>Edition Not Found (404)</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The requested spine or screening room route does not exist in the
          Watchlo archive.
        </p>
        <Button asChild size="sm" className="mt-1">
          <Link href="/">Browse Repertory Catalog</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
