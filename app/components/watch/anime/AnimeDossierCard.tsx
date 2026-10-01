"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  Check,
  ExternalLink,
  Calendar,
  Layers,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Volume2,
  Tv,
} from "lucide-react";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type";

interface AnimeDossierCardProps {
  id: string;
  ep: string | number;
  animeV1: AnimeDetails;
  animeV2?: AnimeInfo;
  isDub?: string;
  onToggleDub?: () => void;
}

export default function AnimeDossierCard({
  id,
  ep,
  animeV1,
  animeV2,
  isDub,
  onToggleDub,
}: AnimeDossierCardProps) {
  const [isNotesExpanded, setIsNotesExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentEpNum = Number(ep) || 1;
  const totalEpisodes =
    animeV1.episodes && animeV1.episodes.length > 0
      ? animeV1.episodes.length
      : typeof animeV1.totalEpisodes === "number" && animeV1.totalEpisodes > 0
        ? animeV1.totalEpisodes
        : 0;

  const statusStr = animeV1.status || animeV2?.status || "Cataloged";
  const isOngoing =
    statusStr.toLowerCase().includes("ongoing") ||
    statusStr.toLowerCase().includes("airing") ||
    statusStr.toLowerCase().includes("releasing");

  // Release year resolution
  const cleanReleased = animeV1.released
    ? animeV1.released.replace(/&nbsp;?/gi, "").trim()
    : null;
  const releaseYear =
    animeV2?.year ||
    cleanReleased ||
    animeV1.releaseDate ||
    animeV2?.startIn?.year ||
    "—";

  // Score resolution
  const scoreVal = animeV2?.score?.decimalScore
    ? animeV2.score.decimalScore.toFixed(1)
    : animeV2?.score?.averageScore
      ? (animeV2.score.averageScore / 10).toFixed(1)
      : null;

  // Format type
  const formatType =
    animeV2?.format || animeV1.type || "TV SERIES";

  // Studio
  const studioName = animeV2?.studios?.[0]?.name;

  // Title resolution
  const dossierTitle =
    (animeV2?.title &&
      (typeof animeV2.title === "object"
        ? animeV2.title.userPreferred || animeV2.title.english || animeV2.title.romaji
        : animeV2.title)) ||
    (animeV1.title ? animeV1.title.split("|||")[0].trim() : "") ||
    "Untitled Edition";

  // Other names alias resolution
  const candidateAliases: string[] = [];
  if (animeV2?.title && typeof animeV2.title === "object") {
    if (animeV2.title.romaji && animeV2.title.romaji !== dossierTitle) {
      candidateAliases.push(animeV2.title.romaji);
    }
    if (animeV2.title.native && animeV2.title.native !== dossierTitle) {
      candidateAliases.push(animeV2.title.native);
    }
    if (animeV2.title.english && animeV2.title.english !== dossierTitle) {
      candidateAliases.push(animeV2.title.english);
    }
  }
  if (Array.isArray(animeV1.otherNames)) {
    candidateAliases.push(
      ...animeV1.otherNames.filter(
        (n) => n && !n.includes("|||") && n !== dossierTitle
      )
    );
  } else if (
    animeV1.otherName &&
    !animeV1.otherName.includes("|||") &&
    animeV1.otherName !== dossierTitle
  ) {
    candidateAliases.push(
      ...animeV1.otherName
        .split("\n")
        .filter((n) => n && n.trim() !== dossierTitle)
    );
  }

  const otherNamesResolved = Array.from(new Set(candidateAliases))
    .slice(0, 3)
    .join(" · ");

  // Synopsis / Liner Notes
  const rawSynopsis =
    animeV1.synopsis ||
    animeV1.description ||
    animeV2?.description ||
    "No archival liner notes filed for this edition.";
  const cleanSynopsis = rawSynopsis.replace(/<[^>]*>?/gm, "").trim();

  const posterImage =
    (animeV1.image && animeV1.image.trim()) ||
    (animeV1.image_url && animeV1.image_url.trim()) ||
    animeV2?.coverImage?.extraLarge ||
    animeV2?.coverImage?.large ||
    animeV2?.coverImage?.medium ||
    animeV2?.bannerImage ||
    "/fallback-card.webp";

  // Handle Share
  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore clipboard error
    }
  };

  const isNumericDetailId = Number.isInteger(Number(animeV2?.id || id));
  const detailTargetId = animeV2?.id || (Number.isInteger(Number(id)) ? id : null);

  return (
    <article className="relative overflow-hidden rounded-sm border border-hairline bg-surface-1 p-4 sm:p-6 shadow-sleeve">
      {/* Top Ledger Strip */}
      <div className="mb-4 flex flex-col gap-2.5 border-b border-hairline pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gold">
              Archival Dossier &amp; Liner Notes
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground sm:inline">
            SPEC-V2
          </span>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-hairline bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/60 hover:text-foreground sm:py-1"
            title="Copy share link to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-3 shrink-0 text-gold" />
                <span className="text-gold font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3 shrink-0 text-gold" />
                <span>Share Reel</span>
              </>
            )}
          </button>
          {isNumericDetailId && detailTargetId ? (
            <Link
              href={`/anime/detail/${detailTargetId}`}
              className="flex items-center justify-center gap-1 rounded-sm border border-hairline bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold sm:py-1"
            >
              <span className="truncate">Full Dossier</span>
              <ExternalLink className="size-3 shrink-0" />
            </Link>
          ) : (
            <Link
              href="/anime"
              className="flex items-center justify-center gap-1 rounded-sm border border-hairline bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold sm:py-1"
            >
              <span className="truncate">Anime Catalog</span>
              <ExternalLink className="size-3 shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area: Side-by-side Poster & Title/Specs even on Mobile */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-start gap-3.5 sm:gap-6">
          {/* Physical Sleeve Cover */}
          <div className="group relative w-24 shrink-0 sm:w-32 md:w-36">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xs border border-hairline bg-surface-2 shadow-md">
              <Image
                unoptimized
                src={posterImage}
                alt={animeV1.title || "Poster sleeve"}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Criterion Spine Tag Top Overlay */}
              <div className="absolute top-1.5 left-1.5 rounded-xs bg-surface-0/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-gold backdrop-blur-xs border border-gold/30">
                #{String(currentEpNum).padStart(2, "0")}
              </div>
              {/* Format chip bottom */}
              <div className="absolute bottom-1.5 right-1.5 rounded-xs bg-surface-0/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground backdrop-blur-xs border border-hairline">
                {formatType}
              </div>
            </div>

            {/* Dub / Sub indicator button */}
            {animeV2?.dub && onToggleDub && (
              <button
                type="button"
                onClick={onToggleDub}
                className={`mt-2 flex w-full items-center justify-center gap-1 rounded-xs border py-1 font-mono text-[9px] sm:text-[10px] uppercase font-bold transition-colors ${
                  isDub
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Volume2 className="size-3 shrink-0" />
                <span>{isDub ? "DUB" : "SUB"}</span>
              </button>
            )}
          </div>

          {/* Text & Specification Ledger */}
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3.5">
            {/* Title block */}
            <div>
              <h2 className="font-display text-base font-bold leading-snug tracking-tight text-foreground sm:text-xl lg:text-2xl">
                {dossierTitle}
              </h2>
              {otherNamesResolved && (
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground line-clamp-1 sm:text-xs">
                  Alias: {otherNamesResolved}
                </p>
              )}
            </div>

            {/* Key Specifications Grid */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Status Chip */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold tabular-nums uppercase ${
                  isOngoing
                    ? "border-vermilion/40 bg-vermilion/10 text-vermilion"
                    : "border-gold/40 bg-gold/10 text-gold"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isOngoing ? "bg-vermilion animate-pulse" : "bg-gold"
                  }`}
                />
                {statusStr}
              </span>

              {/* Total Episodes */}
              {totalEpisodes > 0 && (
                <span className="inline-flex items-center gap-1 rounded-xs border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] tabular-nums text-foreground">
                  <Layers className="size-3 shrink-0 text-gold" />
                  <span>{totalEpisodes} Reels</span>
                </span>
              )}

              {/* Release Date */}
              {releaseYear && releaseYear !== "—" && (
                <span className="inline-flex items-center gap-1 rounded-xs border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] tabular-nums text-muted-foreground">
                  <Calendar className="size-3 shrink-0 text-gold" />
                  <span>{releaseYear}</span>
                </span>
              )}

              {/* Score */}
              {scoreVal && (
                <span className="inline-flex items-center gap-1 rounded-xs border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] tabular-nums font-bold text-gold">
                  <Star className="size-3 shrink-0 fill-gold text-gold" />
                  <span>{scoreVal} / 10</span>
                </span>
              )}

              {/* Studio */}
              {studioName && (
                <span className="inline-flex items-center gap-1 rounded-xs border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] text-muted-foreground">
                  <Tv className="size-3 shrink-0 text-gold" />
                  <span>{studioName}</span>
                </span>
              )}
            </div>

            {/* Genres Chips (Desktop inside right col, Mobile below) */}
            {animeV1.genres && animeV1.genres.length > 0 && (
              <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1">
                  Genres:
                </span>
                {animeV1.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/anime?genre=${encodeURIComponent(genre.toLowerCase())}`}
                    className="rounded-xs border border-hairline bg-surface-2/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/50 hover:bg-surface-3 hover:text-gold"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            {/* Desktop Liner Notes */}
            <div className="mt-1 hidden rounded-xs border border-hairline/60 bg-surface-2/40 p-4 sm:block">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  <BookOpen className="size-3.5 shrink-0 text-gold" />
                  <span>Archival Liner Notes</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                  className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-gold hover:underline cursor-pointer"
                >
                  <span>{isNotesExpanded ? "Collapse" : "Read Full Notes"}</span>
                  {isNotesExpanded ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>
              </div>
              <p
                className={`font-sans text-sm leading-relaxed text-foreground/80 ${
                  isNotesExpanded ? "" : "line-clamp-2"
                }`}
              >
                {cleanSynopsis}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-only Full-Width Genres & Liner Notes below the Poster+Title row */}
        {animeV1.genres && animeV1.genres.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:hidden">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1">
              Genres:
            </span>
            {animeV1.genres.map((genre) => (
              <Link
                key={genre}
                href={`/anime?genre=${encodeURIComponent(genre.toLowerCase())}`}
                className="rounded-xs border border-hairline bg-surface-2/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/50 hover:bg-surface-3 hover:text-gold"
              >
                {genre}
              </Link>
            ))}
          </div>
        )}

        <div className="rounded-xs border border-hairline/60 bg-surface-2/40 p-3 sm:hidden">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <BookOpen className="size-3.5 shrink-0 text-gold" />
              <span>Liner Notes</span>
            </span>
            <button
              type="button"
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
              className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-gold hover:underline cursor-pointer"
            >
              <span>{isNotesExpanded ? "Collapse" : "Expand Notes"}</span>
              {isNotesExpanded ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          </div>
          <p
            className={`font-sans text-xs leading-relaxed text-foreground/80 ${
              isNotesExpanded ? "" : "line-clamp-3"
            }`}
          >
            {cleanSynopsis}
          </p>
        </div>
      </div>
    </article>
  );
}
