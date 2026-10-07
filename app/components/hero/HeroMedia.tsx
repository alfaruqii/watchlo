"use client";
import { useState, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { Play, Star, Film, BookOpen } from "lucide-react";
import Genre from "@/components/genre/Genre";
import { Title, CoverImage } from "@/types/anime.type";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type MediaProps = {
  id: number;
  spineNumber?: number;
  year?: string;
  score?: string;
  title: string | Title;
  description: string;
  genres?: string[];
  bannerImage?: string;
  coverImage: string | CoverImage;
};

function HeroMedia({
  id,
  spineNumber = 1,
  year = "2025",
  score = "8.4",
  title,
  description,
  bannerImage,
  coverImage,
  genres,
}: MediaProps) {
  const [isImageLoading, setImageLoading] = useState(true);
  const pathName = usePathname();
  const pathType = pathName.split("/")[1];
  const isManga = pathType?.toLowerCase() === "manga";

  const parsedDescription = useMemo(() => {
    if (!description) return null;
    const cleaned = description
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/<br\s*\/?>/gi, "");
    return parse(cleaned);
  }, [description]);

  const displayTitle = typeof title === "string" ? title : title.userPreferred;
  const displayCoverImage =
    typeof coverImage === "string" ? coverImage : coverImage.extraLarge;

  const determineNavigateTo = (): string => {
    if (isManga) return `/manga/detail/${id}`;
    if (pathType.toLowerCase() === "anime") return `/anime/detail/${id}`;
    if (pathType.toLowerCase() === "series") return `/series/detail/${id}`;
    return `/movie/detail/${id}`;
  };

  const formattedSpine = String(spineNumber).padStart(3, "0");

  return (
    <article
      className="embla__slide obi-frame-corners relative grid min-h-[380px] w-full min-w-full shrink-0 grid-cols-1 overflow-hidden bg-surface-1 sm:min-h-[440px] md:grid-cols-12 lg:min-h-[480px]"
      key={id}
    >
      {/* Vertical OBI Metadata Spine Column (Left 2 cols on md+) */}
      <div className="relative z-20 hidden flex-col justify-between border-r border-hairline bg-surface-1 p-4 md:col-span-2 md:flex">
        <div className="flex flex-col gap-1 border-b border-hairline pb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            CRITERION SPINE
          </span>
          <span className="font-mono text-2xl font-bold text-gold tabular-nums">
            #{formattedSpine}
          </span>
        </div>

        <div className="my-auto flex flex-col gap-3 py-4">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              CATALOG ID
            </span>
            <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
              WLO-{id}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              RELEASE YEAR
            </span>
            <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
              {year}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              ARCHIVE RATING
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-gold tabular-nums">
              <Star className="size-3 fill-gold text-gold" />
              {score} / 10
            </span>
          </div>
        </div>

        <div className="border-t border-hairline pt-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {isManga ? (
              <BookOpen className="size-3 text-gold" strokeWidth={1.75} />
            ) : (
              <Film className="size-3 text-gold" strokeWidth={1.75} />
            )}
            {isManga
              ? "MANGA ED."
              : pathType.toLowerCase() === "anime"
              ? "ANIME ED."
              : "CINEMA ED."}
          </span>
        </div>
      </div>

      {/* Widescreen 35mm Still & Feature Dossier (10 cols on md+) */}
      <div className="relative flex min-h-[380px] flex-col justify-end p-4 sm:min-h-[440px] sm:p-6 md:col-span-10 md:p-8 lg:min-h-[480px] lg:p-10">
        {(bannerImage || displayCoverImage) && (
          <Image
            unoptimized
            alt={displayTitle ?? "Featured media"}
            src={
              (bannerImage && bannerImage.trim()) ||
              (displayCoverImage && displayCoverImage.trim()) ||
              "/fallback-banner.webp"
            }
            fill
            priority={spineNumber === 1}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            className={`inset-0 z-0 h-full w-full object-cover transition-all duration-700 ease-out ${
              isImageLoading ? "scale-105 blur-2xl" : "scale-100 blur-0"
            }`}
          />
        )}

        {/* Warm Obsidian Projection Vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/75 to-[#0d0c0a]/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-r from-[#0d0c0a]/90 via-[#0d0c0a]/50 to-transparent"
        />

        {/* Editorial Dossier Content (Heading leads directly — no eyebrow above h1) */}
        <div className="relative z-20 flex max-w-3xl flex-col gap-2.5 text-[#f2ece1] sm:gap-3.5">
          <h1 className="line-clamp-2 text-balance font-display text-xl font-extrabold tracking-tight text-[#f2ece1] sm:text-3xl md:text-4xl lg:text-5xl">
            {displayTitle}
          </h1>

          {/* Horizontal OBI Metadata Bar below title */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-[#f2ece1]/80 tabular-nums sm:gap-2 sm:text-xs">
            <span className="shrink-0 rounded-sm bg-[#e09f3e] px-2 py-0.5 font-semibold text-[#0d0c0a]">
              SPINE #{formattedSpine}
            </span>
            <span className="shrink-0 rounded-sm border border-[#f2ece1]/25 bg-[#0d0c0a]/70 px-2 py-0.5">
              {year}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-[#f2ece1]/25 bg-[#0d0c0a]/70 px-2 py-0.5 text-[#e09f3e]">
              <Star className="size-3 shrink-0 fill-[#e09f3e] text-[#e09f3e]" />
              {score}
            </span>
            {genres?.slice(0, 3).map((genre, index) => (
              <Genre key={index} genre={genre} />
            ))}
          </div>

          {description && (
            <p className="line-clamp-2 max-w-[65ch] text-xs leading-relaxed text-[#f2ece1]/85 sm:line-clamp-3 sm:text-sm">
              {parsedDescription}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="rounded-sm bg-[#e09f3e] px-6 font-display text-sm font-bold text-[#0d0c0a] hover:bg-[#e09f3e]/90"
            >
              <Link href={determineNavigateTo()}>
                {isManga ? (
                  <BookOpen className="size-4 text-[#0d0c0a]" strokeWidth={2} />
                ) : (
                  <Play className="size-4 fill-[#0d0c0a]" strokeWidth={2} />
                )}
                <span>{isManga ? "Read Edition" : "Watch"}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(HeroMedia);
