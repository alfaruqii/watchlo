"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  FastForward,
  Check,
  Disc,
  RotateCcw,
  RotateCw,
  Gauge,
  PictureInPicture2,
  Tv,
  HelpCircle,
  Captions,
} from "lucide-react";
import { Source, SubtitleTrack } from "@/types/anime.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnimeScreeningDeckProps {
  currentEp: number;
  totalEpisodes: number;
  sources?: Source[];
  activeQuality?: string;
  onQualityChange?: (url: string, quality: string) => void;
  subtitles?: SubtitleTrack[];
  activeSubtitle?: string;
  onSubtitleChange?: (label: string) => void;
  onPrevReel?: () => void;
  onNextReel?: () => void;
  autoNext: boolean;
  onToggleAutoNext: () => void;
  onSeek?: (offsetSeconds: number) => void;
  onSkipIntro?: () => void;
  skipLabel?: string;
  playbackSpeed?: number;
  onSpeedChange?: (speed: number) => void;
  onTogglePiP?: () => void;
  theaterMode?: boolean;
  onToggleTheaterMode?: () => void;
  onOpenShortcuts?: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AnimeScreeningDeck({
  currentEp,
  totalEpisodes,
  sources = [],
  activeQuality,
  onQualityChange,
  subtitles = [],
  activeSubtitle = "English",
  onSubtitleChange,
  onPrevReel,
  onNextReel,
  autoNext,
  onToggleAutoNext,
  onSeek,
  onSkipIntro,
  skipLabel,
  playbackSpeed = 1,
  onSpeedChange,
  onTogglePiP,
  theaterMode = false,
  onToggleTheaterMode,
  onOpenShortcuts,
}: AnimeScreeningDeckProps) {
  const hasPrev = currentEp > 1;
  const hasNext = currentEp < totalEpisodes;
  const hasSubs = subtitles.length > 0 && Boolean(onSubtitleChange);

  return (
    <div className="flex flex-col gap-2.5 rounded-sm border border-hairline bg-surface-1 p-3 sm:gap-3 sm:p-4 shadow-sm">
      {/* Upper Control Bar: Reel Nav, Quick Seeks, and Primary Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2.5">
        {/* Row 1 (Mobile) / Left (Desktop): Reel Number & Prev / Next Controls */}
        <div className="flex w-full items-center justify-between gap-1.5 sm:w-auto sm:justify-start sm:gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!hasPrev}
            onClick={onPrevReel}
            className="h-8 shrink-0 gap-1 border-hairline bg-surface-2 px-2.5 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold disabled:opacity-40"
            title="Screen Previous Reel (Shortcut: P)"
          >
            <ChevronLeft className="size-3.5" />
            <span>Prev</span>
            <span className="hidden font-mono text-[9px] text-muted-foreground md:inline">[P]</span>
          </Button>

          {/* Current Reel Indicator */}
          <div className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-sm border border-hairline bg-surface-2 px-2.5 font-mono text-xs tabular-nums sm:flex-initial sm:px-3">
            <Disc className="size-3 shrink-0 text-gold animate-[spin_8s_linear_infinite]" />
            <span className="font-bold text-foreground">
              Reel #{String(currentEp).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{totalEpisodes}</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!hasNext}
            onClick={onNextReel}
            className="h-8 shrink-0 gap-1 border-hairline bg-surface-2 px-2.5 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold disabled:opacity-40"
            title="Screen Next Reel (Shortcut: N)"
          >
            <span>Next</span>
            <span className="hidden font-mono text-[9px] text-muted-foreground md:inline">[N]</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        {/* Row 2 (Mobile) / Center (Desktop): Quick Seek Controls (-10s, +10s, Skip OP) */}
        <div className="grid w-full grid-cols-3 gap-1.5 sm:flex sm:w-auto sm:items-center">
          {onSeek && (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onSeek(-10)}
                className="h-8 w-full justify-center gap-1 border-hairline bg-surface-2 px-2 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold sm:w-auto sm:px-2.5"
                title="Rewind 10 Seconds (Shortcut: ← or J)"
              >
                <RotateCcw className="size-3 shrink-0 text-gold" />
                <span>-10s</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onSeek(10)}
                className="h-8 w-full justify-center gap-1 border-hairline bg-surface-2 px-2 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold sm:w-auto sm:px-2.5"
                title="Forward 10 Seconds (Shortcut: → or L)"
              >
                <span>+10s</span>
                <RotateCw className="size-3 shrink-0 text-gold" />
              </Button>
            </>
          )}

          {onSkipIntro && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onSkipIntro}
              className="h-8 w-full justify-center gap-1 border-gold/40 bg-gold/10 px-2 font-mono text-xs font-bold text-gold hover:border-gold hover:bg-gold/20 sm:w-auto sm:px-2.5"
              title="Skip Opening / Ending (Shortcut: S)"
            >
              <FastForward className="size-3 shrink-0" />
              <span className="sm:hidden">{skipLabel ? "Skip OP" : "Skip OP"}</span>
              <span className="hidden sm:inline">{skipLabel || "Skip OP (+85s)"}</span>
            </Button>
          )}
        </div>

        {/* Row 3 (Mobile) / Right (Desktop): Speed, Quality, Subtitles, Auto-Next, PiP & Theater Mode */}
        <div className="grid w-full grid-cols-4 gap-1.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2">
          {/* Speed Selector */}
          {onSpeedChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-full justify-center gap-1 border-hairline bg-surface-2 px-2 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold sm:w-auto sm:px-2.5"
                  title="Playback Speed"
                >
                  <Gauge className="size-3 shrink-0 text-gold" />
                  <span>{playbackSpeed}x</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 border border-hairline bg-surface-2 p-1 text-foreground"
              >
                <div className="border-b border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Speed Rates
                </div>
                {SPEED_OPTIONS.map((rate) => {
                  const isSelected = playbackSpeed === rate;
                  return (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => onSpeedChange(rate)}
                      className={`flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 font-mono text-xs ${
                        isSelected
                          ? "bg-gold/15 text-gold font-bold"
                          : "text-foreground hover:bg-surface-3"
                      }`}
                    >
                      <span>{rate === 1 ? "1.0x (Normal)" : `${rate}x`}</span>
                      {isSelected && <Check className="size-3 text-gold" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Quality Selector */}
          {sources.length > 0 && onQualityChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-full justify-center gap-1 border-hairline bg-surface-2 px-2 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold sm:w-auto sm:gap-1.5 sm:px-2.5"
                >
                  <SlidersHorizontal className="size-3 shrink-0 text-gold" />
                  <span className="truncate uppercase">
                    {activeQuality === "default" ? "AUTO" : activeQuality || "AUTO"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border border-hairline bg-surface-2 p-1 text-foreground"
              >
                <div className="border-b border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Available Streams
                </div>
                {sources.map((source, idx) => {
                  const isSelected =
                    activeQuality === source.quality ||
                    (!activeQuality && (source.quality === "default" || source.quality === "auto"));
                  return (
                    <DropdownMenuItem
                      key={`${source.quality || "stream"}-${source.url || idx}`}
                      onClick={() => onQualityChange(source.url, source.quality)}
                      className={`flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 font-mono text-xs ${
                        isSelected
                          ? "bg-gold/15 text-gold font-bold"
                          : "text-foreground hover:bg-surface-3"
                      }`}
                    >
                      <span className="capitalize">{source.label || source.quality}</span>
                      {isSelected && <Check className="size-3 text-gold" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Subtitles / CC Selector */}
          {hasSubs && onSubtitleChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 w-full justify-center gap-1 border px-2 font-mono text-xs transition-colors sm:w-auto sm:px-2.5 ${
                    activeSubtitle !== "off"
                      ? "border-gold/50 bg-gold/10 text-gold font-bold"
                      : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                  title="Subtitles / Captions (Shortcut: C)"
                >
                  <Captions className="size-3.5 shrink-0 text-gold" />
                  <span className="truncate uppercase">
                    {activeSubtitle === "off"
                      ? "OFF"
                      : /indonesian|indo/i.test(activeSubtitle)
                        ? "IND"
                        : activeSubtitle.slice(0, 3)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-64 w-56 overflow-y-auto border border-hairline bg-surface-2 p-1 text-foreground"
              >
                <div className="sticky top-0 z-10 border-b border-hairline bg-surface-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Subtitles [C]
                </div>
                <DropdownMenuItem
                  onClick={() => onSubtitleChange("off")}
                  className={`flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 font-mono text-xs ${
                    activeSubtitle === "off"
                      ? "bg-gold/15 text-gold font-bold"
                      : "text-foreground hover:bg-surface-3"
                  }`}
                >
                  <span>Off / Disabled</span>
                  {activeSubtitle === "off" && <Check className="size-3 text-gold" />}
                </DropdownMenuItem>
                {subtitles.map((sub, idx) => {
                  const isSelected = activeSubtitle === sub.label;
                  return (
                    <DropdownMenuItem
                      key={`${sub.label}-${idx}`}
                      onClick={() => onSubtitleChange(sub.label)}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-xs px-2 py-1.5 font-mono text-xs ${
                        isSelected
                          ? "bg-gold/15 text-gold font-bold"
                          : "text-foreground hover:bg-surface-3"
                      }`}
                    >
                      <span className="truncate">{sub.label}</span>
                      {isSelected && <Check className="size-3 shrink-0 text-gold" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Auto-Next Switch */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onToggleAutoNext}
            className={`h-8 w-full justify-center gap-1 border px-2 font-mono text-xs transition-colors sm:w-auto sm:px-2.5 ${
              autoNext
                ? "border-gold/60 bg-gold/15 text-gold font-bold"
                : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground"
            }`}
            title="Automatically advance to the next reel when playback finishes"
          >
            <FastForward className="size-3 shrink-0" />
            <span className="hidden sm:inline">Auto-Next:</span>
            <span>{autoNext ? "ON" : "OFF"}</span>
          </Button>

          {/* Picture-in-Picture Toggle */}
          {onTogglePiP && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onTogglePiP}
              className={`${
                hasSubs ? "hidden sm:inline-flex" : "inline-flex"
              } h-8 w-full justify-center gap-1 border-hairline bg-surface-2 px-2 font-mono text-xs text-foreground hover:border-gold/60 hover:text-gold sm:w-auto sm:px-2.5`}
              title="Toggle Picture-in-Picture (Shortcut: I)"
            >
              <PictureInPicture2 className="size-3.5 shrink-0 text-gold" />
              <span>PiP</span>
            </Button>
          )}

          {/* Theater Mode Toggle (Desktop) */}
          {onToggleTheaterMode && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onToggleTheaterMode}
              className={`hidden h-8 gap-1 border px-2.5 font-mono text-xs transition-colors lg:inline-flex ${
                theaterMode
                  ? "border-gold/60 bg-gold/15 text-gold font-bold"
                  : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle Full-Width Cinema Theater Stage (Shortcut: T)"
            >
              <Tv className="size-3.5 text-gold" />
              <span>{theaterMode ? "Normal View" : "Theater Mode"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Stream Health & Shortcut Footnote */}
      <div className="flex items-center justify-between gap-2 border-t border-hairline pt-2 font-mono text-[10px] text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5 truncate">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">
            HLS BROADCAST ACTIVE
            {hasSubs && <span className="text-gold">{" · SUB READY"}</span>}
            <span className="hidden sm:inline">{" // SECURE RELAY"}</span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="flex items-center gap-1 text-gold hover:underline"
              title="Open keyboard shortcuts cheat sheet"
            >
              <HelpCircle className="size-3 shrink-0" />
              <span>
                Hotkeys <span className="hidden sm:inline">Guide </span>[?]
              </span>
            </button>
          )}
          <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground/70">
            <span>·</span>
            <span>[Space] Pause</span>
            <span>·</span>
            <span>[←/→] ±10s</span>
            <span>·</span>
            <span>[C] Subtitles</span>
            <span>·</span>
            <span>[S] Skip OP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
