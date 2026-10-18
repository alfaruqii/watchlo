"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Disc, Search, Hash } from "lucide-react";
import { AnimeEpisode } from "@/types/anime.type";
import { Button } from "@/components/ui/button";

interface AnimeReelRackProps {
  id: string;
  episodes: AnimeEpisode[];
  currentEp: string | number;
  isDub?: string;
  onEpisodeChange: (episodeNumber: number, episodeId?: string) => void;
}

const CHUNK_SIZE = 50;

export default function AnimeReelRack({
  episodes,
  currentEp,
  onEpisodeChange,
}: AnimeReelRackProps) {
  const currentEpNum = Number(currentEp) || 1;

  // Calculate chunks of 50 episodes
  const totalEpisodes = episodes.length;
  const chunkCount = Math.max(1, Math.ceil(totalEpisodes / CHUNK_SIZE));

  // Determine which chunk contains the current episode
  const initialChunkIndex = Math.min(
    chunkCount - 1,
    Math.max(0, Math.floor((currentEpNum - 1) / CHUNK_SIZE))
  );

  const [activeChunkIndex, setActiveChunkIndex] = useState<number>(initialChunkIndex);
  const [jumpInput, setJumpInput] = useState<string>("");
  const [jumpError, setJumpError] = useState<string>("");

  const activeBtnRef = useRef<HTMLButtonElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  // Sync chunk index when currentEp changes
  useEffect(() => {
    const chunkIdx = Math.min(
      chunkCount - 1,
      Math.max(0, Math.floor((currentEpNum - 1) / CHUNK_SIZE))
    );
    setActiveChunkIndex(chunkIdx);
  }, [currentEpNum, chunkCount]);

  // Scroll active episode into view within the grid
  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentEpNum, activeChunkIndex]);

  // Get current chunk episodes
  const visibleEpisodes = useMemo(() => {
    if (episodes.length <= CHUNK_SIZE) {
      return episodes;
    }
    const start = activeChunkIndex * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    return episodes.slice(start, end);
  }, [episodes, activeChunkIndex]);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEp = parseInt(jumpInput.trim(), 10);
    if (isNaN(targetEp) || targetEp < 1 || targetEp > totalEpisodes) {
      setJumpError(`1 - ${totalEpisodes}`);
      setTimeout(() => setJumpError(""), 2500);
      return;
    }

    const matchedEp = episodes.find((ep) => Number(ep.number) === targetEp);
    if (matchedEp) {
      setJumpInput("");
      setJumpError("");
      onEpisodeChange(targetEp, matchedEp.id);
    } else {
      setJumpError("Reel not found");
      setTimeout(() => setJumpError(""), 2500);
    }
  };

  return (
    <aside className="flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sleeve">
      {/* Header */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Disc className="size-4 shrink-0 text-gold animate-[spin_10s_linear_infinite]" strokeWidth={1.75} />
          <div>
            <h2 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
              Reel Rack — Editions
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Now Playing Reel #{String(currentEpNum).padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
          <span className="rounded-sm border border-hairline bg-surface-2 px-2 py-0.5 text-gold font-bold">
            {totalEpisodes} REELS
          </span>
        </div>
      </div>

      {/* Jump input bar */}
      <div className="mb-3">
        <form
          onSubmit={handleJumpSubmit}
          className="flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-2/60 p-1"
        >
          <div className="flex items-center pl-1.5 text-muted-foreground">
            <Hash className="size-3 text-gold" />
          </div>
          <input
            type="number"
            min={1}
            max={totalEpisodes}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            placeholder={`Jump to Reel # (1 - ${totalEpisodes})...`}
            className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {jumpError && (
            <span className="shrink-0 font-mono text-[10px] text-vermilion">
              {jumpError}
            </span>
          )}
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="h-7 px-2 font-mono text-[11px] text-foreground hover:text-gold"
          >
            <Search className="size-3 mr-1 text-gold" />
            Go
          </Button>
        </form>
      </div>

      {/* Range chunk tabs (only if total episodes > CHUNK_SIZE) */}
      {chunkCount > 1 && (
        <div className="mb-3 flex flex-col gap-1.5 border-b border-hairline pb-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            <span>Archival Arcs / Ranges:</span>
            <span>
              Arc {activeChunkIndex + 1} of {chunkCount}
            </span>
          </div>
          <div
            ref={chipsContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-hairline scrollbar-track-transparent"
          >
            {Array.from({ length: chunkCount }).map((_, idx) => {
              const startEp = idx * CHUNK_SIZE + 1;
              const endEp = Math.min((idx + 1) * CHUNK_SIZE, totalEpisodes);
              const isActive = idx === activeChunkIndex;
              const containsCurrent =
                currentEpNum >= startEp && currentEpNum <= endEp;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveChunkIndex(idx)}
                  className={`shrink-0 rounded-sm border px-2 py-1 font-mono text-[11px] tabular-nums transition-colors ${
                    isActive
                      ? "border-gold bg-gold/15 text-gold font-bold shadow-sm"
                      : containsCurrent
                        ? "border-gold/50 bg-surface-2 text-foreground font-semibold"
                        : "border-hairline bg-surface-2/70 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                  }`}
                >
                  {startEp}–{endEp}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid of episodes */}
      <div className="grid max-h-[380px] grid-cols-5 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-5 lg:grid-cols-5 scrollbar-thin scrollbar-thumb-hairline scrollbar-track-transparent">
        {visibleEpisodes.map((episode) => {
          const epNum = Number(episode.number) || 1;
          const isActive = epNum === currentEpNum;

          return (
            <button
              key={episode.id || epNum}
              ref={isActive ? activeBtnRef : null}
              type="button"
              onClick={() => onEpisodeChange(epNum, episode.id)}
              className={`flex h-9 items-center justify-center rounded-sm border font-mono text-xs tabular-nums transition-all ${
                isActive
                  ? "border-gold bg-gold text-surface-0 font-bold shadow-gold ring-1 ring-gold"
                  : "border-hairline bg-surface-2/60 text-muted-foreground hover:border-gold/50 hover:bg-surface-3 hover:text-gold"
              }`}
              title={`Reel #${epNum}`}
            >
              {epNum}
            </button>
          );
        })}
      </div>

      {/* Footer helper */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-hairline pt-2 text-[10px] font-mono text-muted-foreground">
        <span>Select reel to screen</span>
        <span className="hidden sm:inline">Shortcuts: [N]ext · [P]rev</span>
        <span className="sm:hidden tabular-nums">
          Arc {activeChunkIndex + 1}/{chunkCount}
        </span>
      </div>
    </aside>
  );
}
