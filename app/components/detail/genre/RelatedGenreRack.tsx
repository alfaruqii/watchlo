"use client";

import Link from "next/link";
import { Tags, Compass, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RelatedGenreRackProps {
  genres: string[] | { id?: number; name: string }[];
  tags?: { id?: number; name: string }[];
  type?: "anime" | "movie" | "series" | "manga";
  title?: string;
}

export default function RelatedGenreRack({
  genres = [],
  tags = [],
  type = "anime",
  title = "Archival Genres & Thematic Tags",
}: RelatedGenreRackProps) {
  const normalizedGenres = genres.map((g) => (typeof g === "string" ? g : g.name));
  const normalizedTags = tags.map((t) => t.name).slice(0, 16);

  if (!normalizedGenres.length && !normalizedTags.length) {
    return null;
  }

  const getTargetUrl = (genre: string) => {
    if (type === "manga") {
      return `/manga?genre=${encodeURIComponent(genre)}`;
    }
    if (type === "anime") {
      return `/anime?genre=${encodeURIComponent(genre)}`;
    }
    return `/?genre=${encodeURIComponent(genre)}`;
  };

  return (
    <section
      aria-label="Related genres and thematic tags"
      className="my-6 rounded-sm border border-hairline bg-surface-1 p-4 sm:p-6"
    >
      <div className="mb-3.5 flex items-center justify-between border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-gold" strokeWidth={1.75} />
          <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
            {title}
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          Cross-Catalog Discovery
        </span>
      </div>

      {/* Primary Genres */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Primary Classifications:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {normalizedGenres.map((genre) => (
            <Link
              key={genre}
              href={getTargetUrl(genre)}
              className="group inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-surface-2 px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              <span>{genre}</span>
              <ExternalLink className="size-2.5 opacity-40 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>

      {/* Thematic Tags if available */}
      {normalizedTags.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-hairline/60 pt-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Tags className="size-3 text-gold" />
            <span>Thematic Descriptors &amp; Tropes:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {normalizedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-hairline/80 bg-surface-2/60 font-mono text-[10px] text-muted-foreground hover:border-hairline hover:text-foreground"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
