"use client";
import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ChevronLeft, ChevronRight, Film, Disc, BookOpen } from "lucide-react";
import Media from "@/components/media/Media";
import AnimeReelRack from "@/components/watch/anime/AnimeReelRack";
import AnimeDossierCard from "@/components/watch/anime/AnimeDossierCard";
import AnimeShortcutsModal from "@/components/watch/anime/AnimeShortcutsModal";
import ErrorView from "@/error";
import Loading from "./loading";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type";
import { Button } from "@/components/ui/button";

type WatchPageParams = {
  searchParams: Promise<{ id: string; ep?: string; isDub?: string }>;
};

const doesIdNumber = (id: unknown): boolean =>
  Boolean(id) && !Number.isNaN(Number(id)) && Number.isInteger(Number(id)) && Number(id) > 0;

const fetchAnimeInfoV1 = async (
  idProvider: string,
  titleHint?: string,
  anilistId?: string | number,
  isAdult?: boolean
) => {
  const params = new URLSearchParams();
  if (idProvider) params.set("query", idProvider);
  if (anilistId) params.set("id", String(anilistId));
  if (titleHint) {
    params.set("title", titleHint);
  }
  if (isAdult) {
    params.set("isAdult", "true");
  }
  const res = await fetch(`/api/anime-infov1?${params.toString()}`);
  if (!res.ok) {
    throw new globalThis.Error("Failed to fetch anime info v1");
  }
  return res.json();
};

const fetchAnimeInfoV2 = async (id: string) => {
  if (doesIdNumber(id)) {
    const res = await fetch(`/api/anime-infov2?query=${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new globalThis.Error("Failed to fetch anime info v2");
    }
    return res.json();
  }
  return null;
};

function WatchPage(props: WatchPageParams) {
  const router = useRouter();
  const searchParams = use(props.searchParams);
  const { id, ep = "1", isDub } = searchParams;

  const currentEpNum = Number(ep) || 1;
  const [episodeId, setEpisodeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"reels" | "dossier">("reels");

  const { data: animeInfoV2, error: errorInfoV2 } = useSWR<AnimeInfo>(
    doesIdNumber(id) ? id : null,
    fetchAnimeInfoV2,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const isAdultAnime = Boolean(
    animeInfoV2?.isAdult || animeInfoV2?.genres?.includes("Hentai")
  );

  const idProvider = isDub
    ? animeInfoV2?.id_provider?.idGogoDub
    : animeInfoV2?.id_provider?.idAnikoto ||
      animeInfoV2?.id_provider?.idGogo ||
      (!doesIdNumber(id) ? id : animeInfoV2?.title?.romaji || animeInfoV2?.title?.english);

  const titleHint = animeInfoV2
    ? Array.from(
        new Set(
          [
            animeInfoV2.title?.english,
            animeInfoV2.title?.romaji,
            animeInfoV2.title?.userPreferred,
          ].filter(Boolean)
        )
      ).join("|||")
    : undefined;

  const effectiveAnilistId = doesIdNumber(id)
    ? id
    : animeInfoV2?.id
      ? String(animeInfoV2.id)
      : undefined;

  const { data: animeInfoV1, error: errorInfoV1 } = useSWR<AnimeDetails>(
    idProvider || effectiveAnilistId ? [idProvider, titleHint, effectiveAnilistId, isAdultAnime, "v1"] : null,
    () => fetchAnimeInfoV1(idProvider || "", titleHint, effectiveAnilistId, isAdultAnime),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // Sync episode ID when anime data or current ep parameter changes
  useEffect(() => {
    if (animeInfoV1?.episodes && animeInfoV1.episodes.length > 0) {
      const selectedEpisode =
        animeInfoV1.episodes.find((e) => Number(e.number) === currentEpNum) ||
        animeInfoV1.episodes[0];

      if (selectedEpisode) {
        setEpisodeId(selectedEpisode.id);
        setIsLoading(false);
      }
    }
  }, [animeInfoV1, currentEpNum]);

  const totalEpisodes =
    animeInfoV1?.episodes?.length || animeInfoV1?.totalEpisodes || 1;

  // Change episode handler
  const handleEpisodeChange = useCallback(
    (targetEpNum: number, targetEpisodeId?: string) => {
      let resolvedId = targetEpisodeId;
      if (!resolvedId && animeInfoV1?.episodes) {
        const match = animeInfoV1.episodes.find(
          (e) => Number(e.number) === targetEpNum
        );
        resolvedId = match?.id;
      }
      if (resolvedId) {
        setEpisodeId(resolvedId);
      }
      const params = new URLSearchParams();
      params.set("id", id);
      params.set("ep", String(targetEpNum));
      if (isDub) params.set("isDub", "true");
      router.push(`/anime/watch?${params.toString()}`);
    },
    [animeInfoV1?.episodes, id, isDub, router]
  );

  const handlePrevEpisode = useCallback(() => {
    if (currentEpNum > 1) {
      handleEpisodeChange(currentEpNum - 1);
    }
  }, [currentEpNum, handleEpisodeChange]);

  const handleNextEpisode = useCallback(() => {
    if (currentEpNum < totalEpisodes) {
      handleEpisodeChange(currentEpNum + 1);
    }
  }, [currentEpNum, totalEpisodes, handleEpisodeChange]);

  const handleToggleDub = useCallback(() => {
    const params = new URLSearchParams();
    params.set("id", id);
    params.set("ep", String(currentEpNum));
    if (!isDub) {
      params.set("isDub", "true");
    }
    router.push(`/anime/watch?${params.toString()}`);
  }, [currentEpNum, id, isDub, router]);

  // Global Keyboard Shortcuts for Reel Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute("contenteditable") === "true";

      if (isTyping) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleNextEpisode();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        handlePrevEpisode();
      } else if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextEpisode, handlePrevEpisode]);

  if (errorInfoV2 || errorInfoV1) return <ErrorView />;
  if (!animeInfoV2 && doesIdNumber(id)) return <Loading />;
  if (isLoading || !animeInfoV1) return <Loading />;

  const posterSrc =
    (animeInfoV1.image && animeInfoV1.image.trim()) ||
    (animeInfoV1.image_url && animeInfoV1.image_url.trim()) ||
    animeInfoV2?.coverImage?.extraLarge ||
    animeInfoV2?.coverImage?.large ||
    animeInfoV2?.coverImage?.medium ||
    animeInfoV2?.bannerImage ||
    "/fallback-card.webp";
  const numericDetailId = Number.isInteger(Number(animeInfoV2?.id || id));
  const detailTarget = animeInfoV2?.id || (Number.isInteger(Number(id)) ? id : null);

  const pageTitle =
    (animeInfoV2?.title &&
      (typeof animeInfoV2.title === "object"
        ? animeInfoV2.title.userPreferred || animeInfoV2.title.english || animeInfoV2.title.romaji
        : animeInfoV2.title)) ||
    (animeInfoV1?.title ? animeInfoV1.title.split("|||")[0].trim() : "") ||
    "Untitled Edition";

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
      {/* 1. Archival Broadcast Breadcrumb Bar */}
      <header className="flex items-center justify-between gap-2 rounded-sm border border-hairline bg-surface-1 px-3 py-2.5 sm:px-4 sm:py-3 shadow-xs">
        {/* Left: Breadcrumbs */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-xs sm:gap-2">
          <Link
            href="/"
            className="hidden text-muted-foreground transition-colors hover:text-gold sm:inline"
          >
            ARCHIVE
          </Link>
          <span className="hidden text-muted-foreground/40 sm:inline">/</span>
          <Link
            href="/anime"
            className="shrink-0 text-muted-foreground transition-colors hover:text-gold"
          >
            ANIME
          </Link>
          <span className="shrink-0 text-muted-foreground/40">/</span>
          <span className="truncate font-bold text-foreground max-w-[130px] xs:max-w-[180px] sm:max-w-[320px]">
            {pageTitle}
          </span>
          <span className="shrink-0 rounded-xs border border-gold/40 bg-gold/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gold tabular-nums sm:px-2 sm:text-xs">
            #{String(currentEpNum).padStart(2, "0")}
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentEpNum <= 1}
            onClick={handlePrevEpisode}
            className="hidden h-7 border-hairline bg-surface-2 px-2.5 font-mono text-[11px] hover:border-gold/60 hover:text-gold disabled:opacity-40 sm:inline-flex"
            title="Previous Reel [P]"
          >
            <ChevronLeft className="size-3 mr-1" />
            Prev
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentEpNum >= totalEpisodes}
            onClick={handleNextEpisode}
            className="hidden h-7 border-hairline bg-surface-2 px-2.5 font-mono text-[11px] hover:border-gold/60 hover:text-gold disabled:opacity-40 sm:inline-flex"
            title="Next Reel [N]"
          >
            Next
            <ChevronRight className="size-3 ml-1" />
          </Button>
          {numericDetailId && detailTarget ? (
            <Link
              href={`/anime/detail/${detailTarget}`}
              className="flex h-7 items-center gap-1 rounded-sm border border-hairline bg-surface-2 px-2 font-mono text-[11px] text-muted-foreground hover:border-gold/60 hover:text-gold transition-colors sm:px-2.5"
              title="View Full Catalog Dossier"
            >
              <Film className="size-3 shrink-0 text-gold" />
              <span>Dossier</span>
            </Link>
          ) : (
            <Link
              href="/anime"
              className="flex h-7 items-center gap-1 rounded-sm border border-hairline bg-surface-2 px-2 font-mono text-[11px] text-muted-foreground hover:border-gold/60 hover:text-gold transition-colors sm:px-2.5"
              title="Return to Anime Catalog"
            >
              <Film className="size-3 shrink-0 text-gold" />
              <span>Catalog</span>
            </Link>
          )}
        </div>
      </header>

      {/* 2. Main Archival Screening Room Stage */}
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Screening Player + (Mobile Tabs / Desktop Dossier) */}
        <section
          className={`flex flex-col gap-6 transition-all duration-300 ${
            theaterMode ? "lg:col-span-12" : "lg:col-span-8"
          }`}
        >
          {/* Main Video Player with Integrated Screening Deck */}
          <Media
            animeId={
              doesIdNumber(id)
                ? id
                : animeInfoV2?.id
                  ? String(animeInfoV2.id)
                  : undefined
            }
            title={pageTitle}
            poster={posterSrc}
            episodeId={episodeId}
            ep={String(currentEpNum)}
            totalEpisodes={totalEpisodes}
            onNextEpisode={handleNextEpisode}
            onPrevEpisode={handlePrevEpisode}
            autoNext={autoNext}
            onToggleAutoNext={() => setAutoNext(!autoNext)}
            theaterMode={theaterMode}
            onToggleTheaterMode={() => setTheaterMode(!theaterMode)}
            onOpenShortcuts={() => setShortcutsOpen(true)}
            className="w-full flex flex-col gap-3"
          />

          {/* Mobile / Tablet Segmented Tab Control (< lg only) */}
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="grid grid-cols-2 rounded-sm border border-hairline bg-surface-1 p-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMobileTab("reels")}
                className={`flex items-center justify-center gap-1.5 py-2 h-auto font-mono text-xs font-bold transition-all rounded-xs ${
                  mobileTab === "reels"
                    ? "bg-gold text-surface-0 shadow-sm hover:bg-gold hover:text-surface-0"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Disc className="size-3.5" />
                <span>Reel Rack ({totalEpisodes})</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMobileTab("dossier")}
                className={`flex items-center justify-center gap-1.5 py-2 h-auto font-mono text-xs font-bold transition-all rounded-xs ${
                  mobileTab === "dossier"
                    ? "bg-gold text-surface-0 shadow-sm hover:bg-gold hover:text-surface-0"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="size-3.5" />
                <span>Archival Dossier</span>
              </Button>
            </div>

            {mobileTab === "reels" ? (
              <AnimeReelRack
                id={id}
                episodes={animeInfoV1.episodes || []}
                currentEp={currentEpNum}
                isDub={isDub}
                onEpisodeChange={handleEpisodeChange}
              />
            ) : (
              <AnimeDossierCard
                id={id}
                ep={currentEpNum}
                animeV1={animeInfoV1}
                animeV2={animeInfoV2}
                isDub={isDub}
                onToggleDub={handleToggleDub}
              />
            )}
          </div>

          {/* Desktop Only: Full Dossier Card under Player (when not in Theater Mode, or stacked below) */}
          <div className="hidden lg:block">
            <AnimeDossierCard
              id={id}
              ep={currentEpNum}
              animeV1={animeInfoV1}
              animeV2={animeInfoV2}
              isDub={isDub}
              onToggleDub={handleToggleDub}
            />
          </div>
        </section>

        {/* Right Column (or Below in Theater Mode): Physical Reel Rack Shelf */}
        <aside
          className={`transition-all duration-300 ${
            theaterMode
              ? "hidden lg:block lg:col-span-12"
              : "hidden lg:block lg:col-span-4"
          }`}
        >
          <div className={theaterMode ? "w-full" : "lg:sticky lg:top-20"}>
            <AnimeReelRack
              id={id}
              episodes={animeInfoV1.episodes || []}
              currentEp={currentEpNum}
              isDub={isDub}
              onEpisodeChange={handleEpisodeChange}
            />
          </div>
        </aside>
      </main>

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <AnimeShortcutsModal
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </div>
  );
}

export default WatchPage;
