"use client";

import { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { AnimeDetails, AnimeInfo } from "@/types/anime.type";
import { AnimeCardDetail } from "../card/AnimeCardDetail";
import SkeletonEpisodes from "@/components/skeleton/SkeletonEpisodes";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

function EpisodesContainer(anime: AnimeInfo) {
  const defaultProvider =
    anime.id_provider?.idAnikoto ||
    anime.id_provider?.idGogo ||
    anime.title?.romaji ||
    anime.title?.english;

  const [provider, setProvider] = useState<string | undefined>(defaultProvider);
  const [episodes, setEpisodes] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const titleHint = Array.from(
    new Set(
      [
        anime.title?.english,
        anime.title?.romaji,
        anime.title?.userPreferred,
      ].filter(Boolean)
    )
  ).join("|||");

  const coverImageHint =
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    anime.coverImage?.medium ||
    anime.bannerImage ||
    "";

  useEffect(() => {
    let cancelled = false;
    async function fetchEpisodes() {
      if (provider || anime.id) {
        setLoading(true);
        try {
          const isAdult = Boolean(anime.isAdult || anime.genres?.includes("Hentai"));
          const params = new URLSearchParams();
          if (provider) params.set("query", provider);
          if (anime.id) params.set("id", String(anime.id));
          if (titleHint) {
            params.set("title", titleHint);
          }
          if (coverImageHint) {
            params.set("image", coverImageHint);
          }
          if (isAdult) {
            params.set("isAdult", "true");
          }
          const response = await fetch(`/api/anime-infov1?${params.toString()}`);
          if (!response.ok) {
            if (!cancelled) setEpisodes(null);
            return;
          }
          const data = await response.json();
          if (!cancelled) {
            setEpisodes(data);
          }
        } catch {
          if (!cancelled) {
            setEpisodes(null);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    }

    fetchEpisodes();
    return () => {
      cancelled = true;
    };
  }, [provider, titleHint, coverImageHint, anime.id, anime.isAdult, anime.genres]);

  return (
    <section className="my-6 overflow-hidden rounded-sm border border-hairline bg-surface-1 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
          <Film className="size-4 text-gold" strokeWidth={1.75} />
          <span>Episode Reels</span>
        </h2>

        {anime.id_provider?.idGogoDub && (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={
                provider === anime.id_provider?.idGogo ? "default" : "outline"
              }
              onClick={() => setProvider(anime.id_provider?.idGogo)}
              disabled={!anime.id_provider?.idGogo}
            >
              SUB EDITION
            </Button>
            <Button
              type="button"
              size="sm"
              variant={
                provider === anime.id_provider?.idGogoDub
                  ? "default"
                  : "outline"
              }
              onClick={() => setProvider(anime.id_provider?.idGogoDub)}
              disabled={!anime.id_provider?.idGogoDub}
            >
              DUB EDITION
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <SkeletonEpisodes noMargin />
      ) : episodes?.episodes?.length ? (
        <Carousel className="w-full">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {episodes.episodes.length} Episodes Indexed // Drag or navigate
            </span>
            <CarouselNavigation />
          </div>
          <div className="relative">
            <CarouselFadeMask fromColor="from-background" />
            <CarouselContent className="-ml-3 pt-2 pb-3">
              {episodes.episodes.map((episode) => {
                const reelCover =
                  episodes.image ||
                  episodes.image_url ||
                  coverImageHint ||
                  "/fallback-card.webp";

                return (
                  <CarouselItem key={episode.id} className="pl-3 basis-auto">
                    <AnimeCardDetail
                      animeImage={reelCover}
                      id={String(anime.id)}
                      episodeNumber={episode.number}
                      episodeId={episode.id}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </div>
        </Carousel>
      ) : (
        <p className="font-mono text-xs text-muted-foreground">
          No episode reels currently indexed for this edition.
        </p>
      )}
    </section>
  );
}

export default EpisodesContainer;
