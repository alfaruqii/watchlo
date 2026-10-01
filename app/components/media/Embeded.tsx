"use client";
import React, { useState } from "react";
import { Settings2, Tv } from "lucide-react";
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

function generateUrl(
  base: string,
  type: string,
  id: string,
  season: string,
  ep: string,
  providerName?: string
) {
  const isMovie = type?.toLowerCase() === "movie";
  let url = isMovie
    ? `${base}/movie/${id}`
    : `${base}/tv/${id}/${season}/${ep}`;

  if (providerName === "vidlink" || base.includes("vidlink.pro")) {
    url += "?primaryColor=f59e0b&secondaryColor=141416&iconColor=f59e0b";
  }

  return url;
}

function Embeded({ id, type, season = "1", ep = "1" }: EmbededProps) {
  const initialProvider =
    sourcesMap.length > 0
      ? sourcesMap[0]
      : {
          name: "videasy",
          label: "Videasy (Sub Indo / Multi-Sub)",
          url: "https://player.videasy.to",
        };
  const [provider, setProvider] = useState<Provider>(initialProvider);

  const handleProviderChange = (providerName: string) => {
    const selectedProvider = sourcesMap.find(
      (source) => source.name === providerName
    );
    setProvider(selectedProvider || sourcesMap[0]);
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
            className="z-50 w-64 rounded-sm border border-hairline bg-surface-1 p-1.5 font-mono text-xs text-foreground sm:w-56"
          >
            {sourcesMap.map((source, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleProviderChange(source.name)}
                className="cursor-pointer rounded-sm px-2.5 py-2 hover:bg-surface-2 hover:text-gold"
              >
                {source.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="obi-frame-corners relative aspect-video w-full overflow-hidden rounded-sm border border-hairline bg-[#0d0c0a]">
        <iframe
          title={`Watchlo Screening Room ${id}`}
          src={generateUrl(provider.url, type, id, season, ep, provider.name)}
          allowFullScreen
          referrerPolicy="no-referrer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="h-full w-full border-0"
        />
      </div>
    </section>
  );
}

export default Embeded;
