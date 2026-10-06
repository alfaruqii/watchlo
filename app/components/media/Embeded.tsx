"use client";
import React, { useState, useEffect } from "react";
import { Settings2, Tv, Info, Check } from "lucide-react";
import sourcesMap from "@/data/watchlo-source.json";
import { Provider } from "@/types/movies.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EmbededProps = {
  id: string;
  type: "movie" | "tv";
  season?: string;
  ep?: string;
};

export function generateUrl(
  base: string,
  type: string,
  id: string,
  season: string = "1",
  ep: string = "1",
  providerName?: string
): string {
  const isMovie = type?.toLowerCase() === "movie";
  const name = (providerName || "").toLowerCase();

  // 1. SuperEmbed / MultiEmbed: query parameter convention for Asian & Indonesian catalog
  if (name === "multiembed" || base.includes("multiembed.mov")) {
    return isMovie
      ? `${base}/?video_id=${id}&tmdb=1`
      : `${base}/?video_id=${id}&tmdb=1&s=${season}&e=${ep}`;
  }

  // 2. SmashyStream: TV uses query parameter convention ?s= &e=
  if (name === "smashystream" || base.includes("smashystream.xyz")) {
    return isMovie
      ? `${base}/movie/${id}`
      : `${base}/tv/${id}?s=${season}&e=${ep}`;
  }

  // 3. VidLink with dark gold theme tokens
  if (name === "vidlink" || base.includes("vidlink.pro")) {
    const url = isMovie
      ? `${base}/movie/${id}`
      : `${base}/tv/${id}/${season}/${ep}`;
    return `${url}?primaryColor=f59e0b&secondaryColor=141416&iconColor=f59e0b`;
  }

  // 4. Standard path-based providers (Embed.su, AutoEmbed, VidSrc CC, VidSrc TO, VidSrc PM, Videasy)
  return isMovie
    ? `${base}/movie/${id}`
    : `${base}/tv/${id}/${season}/${ep}`;
}

function Embeded({ id, type, season = "1", ep = "1" }: EmbededProps) {
  const initialProvider =
    sourcesMap.length > 0
      ? sourcesMap[0]
      : {
          name: "embedsu",
          label: "Embed.su (Fast HD · Multi-Sub / Indo)",
          url: "https://embed.su/embed",
        };
  const [provider, setProvider] = useState<Provider>(initialProvider);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("watchlo_embed_provider");
      if (saved) {
        const found = sourcesMap.find((source) => source.name === saved);
        if (found) setProvider(found);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  const handleProviderChange = (providerName: string) => {
    const selectedProvider = sourcesMap.find(
      (source) => source.name === providerName
    );
    const chosen = selectedProvider || sourcesMap[0];
    setProvider(chosen);
    try {
      localStorage.setItem("watchlo_embed_provider", chosen.name);
    } catch {
      // ignore storage access errors
    }
  };

  const doesTV = type?.toLowerCase() === "tv";

  return (
    <section
      className={`${
        doesTV ? "col-span-3" : ""
      } flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5`}
    >
      <div className="mb-3 flex flex-col gap-2.5 border-b border-hairline pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
          <Tv className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
          <span>
            {type.toLowerCase() === "movie"
              ? "Screening Room — Feature"
              : `Screening Room — S${String(season).padStart(
                  2,
                  "0"
                )} · E${String(ep).padStart(2, "0")}`}
          </span>
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between gap-2 font-mono text-xs sm:w-auto sm:justify-center"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Settings2 className="size-3.5 shrink-0 text-gold" strokeWidth={1.75} />
                <span className="truncate">SOURCE: {provider.label}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-50 w-72 rounded-sm border border-hairline bg-surface-1 p-1.5 font-mono text-xs text-foreground sm:w-64"
          >
            {sourcesMap.map((source, index) => {
              const isActive = provider.name === source.name;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleProviderChange(source.name)}
                  className={`flex items-center justify-between cursor-pointer rounded-sm px-2.5 py-2 hover:bg-surface-2 hover:text-gold ${
                    isActive ? "text-gold font-semibold bg-surface-2/40" : ""
                  }`}
                >
                  <span className="truncate">{source.label}</span>
                  {isActive && <Check className="size-3.5 ml-2 shrink-0 text-gold" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="obi-frame-corners relative aspect-video w-full overflow-hidden rounded-sm border border-hairline bg-[#0d0c0a]">
        <iframe
          key={`${provider.name}-${id}-${season}-${ep}`}
          title={`Watchlo Screening Room ${id}`}
          src={generateUrl(provider.url, type, id, season, ep, provider.name)}
          allowFullScreen
          referrerPolicy="origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="h-full w-full border-0"
        />
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-sm border border-hairline/60 bg-surface-2/40 px-3 py-2 text-[11px] text-muted-foreground font-mono leading-relaxed">
        <Info className="size-3.5 shrink-0 text-gold mt-0.5" strokeWidth={1.75} />
        <div>
          <span className="text-foreground font-medium">Tips Player:</span>{" "}
          Gunakan <span className="text-gold font-semibold">Embed.su</span> atau{" "}
          <span className="text-gold font-semibold">AutoEmbed</span> untuk subtitle Indonesia & multi-server. Jika film Indonesia/Asia bertuliskan <em>unavailable</em>, ganti SOURCE ke{" "}
          <span className="text-gold font-semibold">SuperEmbed</span>.
        </div>
      </div>
    </section>
  );
}

export default Embeded;
