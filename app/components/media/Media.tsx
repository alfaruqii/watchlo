"use client";
import { StreamInfo, SubtitleTrack, AniSkipResponse, SkipTime } from "@/types/anime.type";
import {
  Gesture,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  Track,
  isHLSProvider,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import Hls from "hls.js";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import SkeletonMediaPlayer from "../skeleton/SkeletonMediaPlayer";
import AnimeScreeningDeck from "../watch/anime/AnimeScreeningDeck";
import Link from "next/link";
import {
  AlertCircle,
  RotateCcw,
  RotateCw,
  FastForward,
  History,
  Loader2,
  Film,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaProps {
  animeId?: string | number;
  poster?: string;
  title: string;
  episodeId: string;
  ep: string;
  totalEpisodes?: number;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  autoNext?: boolean;
  onToggleAutoNext?: () => void;
  theaterMode?: boolean;
  onToggleTheaterMode?: () => void;
  onOpenShortcuts?: () => void;
  className?: string;
}

const fetchAnimeStream = async (
  queryKey: string | [string | null, string | number | undefined, string | undefined] | null
) => {
  if (!queryKey) return null;
  const [episodeId, animeId, ep] = Array.isArray(queryKey)
    ? queryKey
    : [queryKey, undefined, undefined];
  if (!episodeId && !animeId) return null;

  const params = new URLSearchParams();
  if (episodeId) params.set("query", episodeId);
  if (animeId) params.set("id", String(animeId));
  if (ep) params.set("ep", String(ep));

  const res = await fetch(`/api/animestream?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const error = new Error(errorData?.error || "Failed to fetch anime stream");
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
};

const fetchSkipTime = async (url: string | null) => {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
};

const formatSeconds = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const Media = ({
  animeId,
  title,
  episodeId,
  ep,
  totalEpisodes = 1,
  onNextEpisode,
  onPrevEpisode,
  autoNext = true,
  onToggleAutoNext,
  theaterMode = false,
  onToggleTheaterMode,
  onOpenShortcuts,
  className = "w-full flex flex-col gap-3",
}: MediaProps) => {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [vidSrc, setVidSrc] = useState<string>("");
  const [activeQuality, setActiveQuality] = useState<string>("auto");
  const [activeSubtitle, setActiveSubtitle] = useState<string>("English");
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [flashNotice, setFlashNotice] = useState<string | null>(null);
  const [resumePrompt, setResumePrompt] = useState<{ time: number } | null>(null);
  const previousEp = useRef<string | null>("");
  const initializedEpRef = useRef<string>("");
  const pendingSeekRef = useRef<number | null>(null);
  const hasResumed = useRef<boolean>(false);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedSecondRef = useRef<number>(-1);

  const {
    data: streamInfo,
    error: errorStream,
    isLoading,
    mutate: retryStream,
  } = useSWR<StreamInfo>(
    episodeId || animeId ? [episodeId || null, animeId, ep] : null,
    fetchAnimeStream,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  // Query Backend AniSkip endpoint for sub-second precision OP/ED/Recap timestamps
  const { data: skiptimeData } = useSWR<AniSkipResponse>(
    animeId && ep ? `/api/anime-skiptime?id=${animeId}&ep=${ep}` : null,
    fetchSkipTime,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  // Extract normalized subtitles list
  const subtitles: SubtitleTrack[] = useMemo(() => {
    const raw = streamInfo?.subtitles ?? streamInfo?.tracks ?? [];
    return raw.filter((s) => Boolean(s.url || s.file));
  }, [streamInfo?.subtitles, streamInfo?.tracks]);

  // Compute unified skipTime prioritizing backend AniSkip precision timestamps
  const skipTime = useMemo((): SkipTime | undefined => {
    const results = skiptimeData?.results;
    const op = results?.op?.interval || results?.mixedOp?.interval;
    const ed = results?.ed?.interval || results?.mixedEd?.interval;
    const recap = results?.recap?.interval;

    if (op || ed || recap || (results?.chapters && results.chapters.length > 0)) {
      return {
        intro: op
          ? { start: op.startTime, end: op.endTime }
          : streamInfo?.info?.skiptime?.intro,
        outro: ed
          ? { start: ed.startTime, end: ed.endTime }
          : streamInfo?.info?.skiptime?.outro,
        recap: recap
          ? { start: recap.startTime, end: recap.endTime }
          : undefined,
        chapters: results?.chapters ?? [],
        raw: skiptimeData,
      };
    }

    return streamInfo?.info?.skiptime;
  }, [skiptimeData, streamInfo?.info?.skiptime]);

  // Generate WebVTT Chapters Track for Vidstack Seekbar
  const chaptersVtt = useMemo(() => {
    const chapters = skipTime?.chapters;
    if (!chapters || chapters.length === 0) return null;

    const formatVttTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 1000);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
    };

    let vtt = "WEBVTT\n\n";
    chapters.forEach((ch, idx) => {
      vtt += `${idx + 1}\n${formatVttTime(ch.startTime)} --> ${formatVttTime(ch.endTime)}\n${ch.title}\n\n`;
    });

    return `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
  }, [skipTime?.chapters]);

  const triggerFlash = useCallback((msg: string) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlashNotice(msg);
    flashTimerRef.current = setTimeout(() => {
      setFlashNotice(null);
    }, 1400);
  }, []);

  // Reset tracking when episode changes
  useEffect(() => {
    if (previousEp.current !== null && previousEp.current !== ep) {
      setCurrentTime(0);
      pendingSeekRef.current = null;
      hasResumed.current = false;
      setResumePrompt(null);
      setIsBuffering(false);
      initializedEpRef.current = "";
      setVidSrc("");
    }
    previousEp.current = ep;
  }, [ep]);

  // Load default source & default subtitle ONCE per episode (never reset on focus or re-render)
  useEffect(() => {
    const effectiveKey = episodeId || (animeId ? `${animeId}-${ep}` : "");
    if (
      effectiveKey &&
      initializedEpRef.current !== effectiveKey &&
      streamInfo?.sources &&
      streamInfo.sources.length > 0
    ) {
      initializedEpRef.current = effectiveKey;
      const defaultSource =
        streamInfo.sources.find(
          (source) => source.quality === "default" || source.quality === "auto"
        ) ?? streamInfo.sources[0];
      setVidSrc(defaultSource.url);
      setActiveQuality(defaultSource.quality || "auto");

      if (subtitles.length > 0) {
        const defSub = subtitles.find((s) => s.default) ?? subtitles[0];
        setActiveSubtitle(defSub.label || "English");
      }
    }
  }, [episodeId, animeId, ep, streamInfo?.sources, subtitles]);

  // Check saved progress from localStorage on initial load
  useEffect(() => {
    if (!episodeId || hasResumed.current) return;
    try {
      const saved = localStorage.getItem(`watchlo_resume_${episodeId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.time && parsed.time > 15 && (!parsed.duration || parsed.time < parsed.duration - 25)) {
          setResumePrompt({ time: parsed.time });
          setCurrentTime(parsed.time);
          pendingSeekRef.current = parsed.time;
          hasResumed.current = true;
          const hideTimer = setTimeout(() => {
            setResumePrompt(null);
          }, 8000);
          return () => clearTimeout(hideTimer);
        }
      }
    } catch {
      // ignore
    }
  }, [episodeId]);

  // Handle Quality Change
  const handleQualityChange = (newSrc: string, quality: string): void => {
    const player = playerRef.current;
    if (player) {
      const savedTime = player.currentTime || currentTime;
      if (savedTime > 0) {
        pendingSeekRef.current = savedTime;
      }
      setCurrentTime(savedTime);
      setVidSrc(newSrc);
      setActiveQuality(quality);
      triggerFlash(`Quality: ${quality.toUpperCase()}`);
    }
  };

  // Handle Subtitle Track Change
  const handleSubtitleChange = useCallback(
    (label: string) => {
      setActiveSubtitle(label);
      const player = playerRef.current;
      if (player?.textTracks) {
        for (const track of player.textTracks) {
          if (label === "off") {
            track.mode = "disabled";
          } else if (track.label.toLowerCase() === label.toLowerCase()) {
            track.mode = "showing";
          } else {
            track.mode = "disabled";
          }
        }
      }
      const vid = document.querySelector<HTMLVideoElement>("video");
      if (vid?.textTracks) {
        for (let i = 0; i < vid.textTracks.length; i++) {
          const t = vid.textTracks[i];
          if (label === "off") {
            t.mode = "disabled";
          } else if (t.label.toLowerCase() === label.toLowerCase()) {
            t.mode = "hidden"; // Vidstack renders active track via vds-captions
          } else {
            t.mode = "disabled";
          }
        }
      }
      triggerFlash(label === "off" ? "Subtitles: OFF" : `Subtitles: ${label}`);
    },
    [triggerFlash]
  );

  // Re-apply active subtitle mode when vidSrc (quality) changes
  useEffect(() => {
    if (!vidSrc) return;
    const timer = setTimeout(() => {
      const player = playerRef.current;
      if (player?.textTracks) {
        for (const track of player.textTracks) {
          if (activeSubtitle === "off") {
            track.mode = "disabled";
          } else if (track.label.toLowerCase() === activeSubtitle.toLowerCase()) {
            track.mode = "showing";
          } else {
            track.mode = "disabled";
          }
        }
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [vidSrc, activeSubtitle]);

  // Handle Seek relative seconds (+10s, -10s)
  const handleSeek = useCallback(
    (offsetSeconds: number) => {
      const vid = document.querySelector<HTMLVideoElement>("video");
      const current = playerRef.current?.currentTime ?? vid?.currentTime ?? currentTime;
      const duration = playerRef.current?.duration ?? vid?.duration ?? Infinity;
      const targetTime = Math.max(0, Math.min(duration, current + offsetSeconds));

      if (playerRef.current) {
        playerRef.current.currentTime = targetTime;
      }
      if (vid) {
        vid.currentTime = targetTime;
      }
      setCurrentTime(targetTime);
      triggerFlash(offsetSeconds > 0 ? `+${offsetSeconds}s` : `${offsetSeconds}s`);
    },
    [currentTime, triggerFlash]
  );

  // Handle Smart Skip Opening / Ending / Recap (uses high-precision AniSkip timestamps when available, otherwise +85s)
  const handleSkipIntro = useCallback(() => {
    const vid = document.querySelector<HTMLVideoElement>("video");
    const current = playerRef.current?.currentTime ?? vid?.currentTime ?? currentTime;
    const duration = playerRef.current?.duration ?? vid?.duration ?? Infinity;

    let targetTime = Math.max(0, Math.min(duration, current + 85));
    let flashText = "Skipped Opening (+85s)";

    if (
      skipTime?.recap &&
      skipTime.recap.end > skipTime.recap.start &&
      current >= skipTime.recap.start &&
      current < skipTime.recap.end - 1
    ) {
      targetTime = Math.min(duration, skipTime.recap.end);
      flashText = `Skipped Recap (to ${formatSeconds(skipTime.recap.end)})`;
    } else if (
      skipTime?.outro &&
      skipTime.outro.end > skipTime.outro.start &&
      current >= skipTime.outro.start - 5 &&
      current < skipTime.outro.end - 1
    ) {
      targetTime = Math.min(duration, skipTime.outro.end);
      flashText = `Skipped Ending (to ${formatSeconds(skipTime.outro.end)})`;
    } else if (
      skipTime?.intro &&
      skipTime.intro.end > skipTime.intro.start &&
      current < skipTime.intro.end - 1
    ) {
      targetTime = Math.min(duration, skipTime.intro.end);
      flashText = `Skipped Intro (to ${formatSeconds(skipTime.intro.end)})`;
    }

    if (playerRef.current) {
      playerRef.current.currentTime = targetTime;
    }
    if (vid) {
      vid.currentTime = targetTime;
    }
    setCurrentTime(targetTime);
    triggerFlash(flashText);
  }, [currentTime, skipTime, triggerFlash]);

  // Handle Playback Speed
  const handleSpeedChange = useCallback(
    (rate: number) => {
      setPlaybackSpeed(rate);
      if (playerRef.current) {
        playerRef.current.playbackRate = rate;
      }
      const vid = document.querySelector<HTMLVideoElement>("video");
      if (vid) {
        vid.playbackRate = rate;
      }
      triggerFlash(`Speed: ${rate}x`);
    },
    [triggerFlash]
  );

  // Handle Picture-in-Picture
  const handleTogglePiP = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        triggerFlash("PiP Exited");
      } else {
        const vid = document.querySelector<HTMLVideoElement>("video");
        if (vid && document.pictureInPictureEnabled) {
          await vid.requestPictureInPicture();
          triggerFlash("PiP Mode Active");
        }
      }
    } catch (err) {
      console.warn("PiP not available:", err);
    }
  }, [triggerFlash]);

  // Restart playback to 0:00
  const handleRestartBeginning = useCallback(() => {
    pendingSeekRef.current = null;
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
    }
    const vid = document.querySelector<HTMLVideoElement>("video");
    if (vid) {
      vid.currentTime = 0;
    }
    setCurrentTime(0);
    setResumePrompt(null);
    triggerFlash("Restarted at 00:00");
  }, [triggerFlash]);

  // Save progress periodically to localStorage
  const handleTimeUpdate = useCallback(
    ({ currentTime: ct }: { currentTime: number }) => {
      if (ct > 0) {
        setCurrentTime(ct);
        setIsBuffering(false);
        const duration = playerRef.current?.duration || 0;
        const currentSec = Math.floor(ct);
        if (
          episodeId &&
          ct > 10 &&
          duration > 0 &&
          ct < duration - 25 &&
          currentSec !== lastSavedSecondRef.current &&
          currentSec % 4 === 0
        ) {
          lastSavedSecondRef.current = currentSec;
          try {
            localStorage.setItem(
              `watchlo_resume_${episodeId}`,
              JSON.stringify({ time: currentSec, duration: Math.floor(duration) })
            );
          } catch {
            // ignore
          }
        }
      }
    },
    [episodeId]
  );

  // Local Keyboard Shortcuts for video player controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute("contenteditable") === "true";

      if (isTyping) return;

      if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        handleSeek(-10);
      } else if (e.key === "ArrowRight" || e.key === "l" || e.key === "L") {
        e.preventDefault();
        handleSeek(10);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleSkipIntro();
      } else if (e.key === "c" || e.key === "C") {
        if (subtitles.length > 0) {
          e.preventDefault();
          const nextSub =
            activeSubtitle === "off"
              ? (subtitles[0]?.label || "English")
              : "off";
          handleSubtitleChange(nextSub);
        }
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        handleTogglePiP();
      } else if (e.key === "t" || e.key === "T") {
        if (onToggleTheaterMode) {
          e.preventDefault();
          onToggleTheaterMode();
        }
      } else if (e.key === "?") {
        if (onOpenShortcuts) {
          e.preventDefault();
          onOpenShortcuts();
        }
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        const vid = document.querySelector<HTMLVideoElement>("video");
        if (vid) {
          vid.muted = !vid.muted;
          triggerFlash(vid.muted ? "Muted" : "Unmuted");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleSeek,
    handleSkipIntro,
    handleSubtitleChange,
    handleTogglePiP,
    onToggleTheaterMode,
    onOpenShortcuts,
    triggerFlash,
    subtitles,
    activeSubtitle,
  ]);

  const currentSource = streamInfo?.sources?.find((s) => s.url === vidSrc);
  const isHls =
    currentSource?.isM3U8 !== undefined
      ? Boolean(currentSource.isM3U8)
      : (vidSrc.includes(".m3u8") ||
         vidSrc.includes("/hls") ||
         vidSrc.includes("hls?"));

  const isDash = vidSrc.includes(".mpd") || currentSource?.quality?.toLowerCase().includes("dash");

  const playerSrc = vidSrc
    ? isHls
      ? { src: vidSrc, type: "application/x-mpegurl" as const }
      : isDash
        ? { src: vidSrc, type: "application/dash+xml" as const }
        : { src: vidSrc, type: "video/mp4" as const }
    : undefined;

  const currentEpNum = Number(ep) || 1;

  // Determine if currentTime is inside Intro, Outro, or Recap window for floating Skip button
  const inRecapWindow = Boolean(
    skipTime?.recap &&
      skipTime.recap.end > skipTime.recap.start &&
      currentTime >= skipTime.recap.start &&
      currentTime < skipTime.recap.end - 1.5
  );
  const inIntroWindow = Boolean(
    skipTime?.intro &&
      skipTime.intro.end > skipTime.intro.start &&
      currentTime >= Math.max(0, skipTime.intro.start) &&
      currentTime < skipTime.intro.end - 1.5
  );
  const inOutroWindow = Boolean(
    skipTime?.outro &&
      skipTime.outro.end > skipTime.outro.start &&
      currentTime >= skipTime.outro.start &&
      currentTime < skipTime.outro.end - 1.5
  );

  const deckSkipLabel =
    inRecapWindow && skipTime?.recap?.end
      ? `Skip Recap (${formatSeconds(skipTime.recap.end)})`
      : inOutroWindow && skipTime?.outro?.end
        ? `Skip ED (${formatSeconds(skipTime.outro.end)})`
        : skipTime?.intro?.end
          ? `Skip OP (${formatSeconds(skipTime.intro.end)})`
          : "Skip OP (+85s)";

  if (errorStream) {
    const errStatus = (errorStream as Error & { status?: number })?.status;
    const isNotFound =
      errStatus === 404 ||
      /not found|404|belum tersedia|unavailable/i.test(errorStream?.message || "");

    return (
      <div className={className}>
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-sm border border-hairline bg-surface-1 p-6 text-center shadow-sleeve">
          <AlertCircle className={`mb-2 size-8 ${isNotFound ? "text-gold" : "text-vermilion"}`} />
          <h3 className="font-display text-base font-bold text-foreground">
            {isNotFound ? "Sumber Video Belum Tersedia" : "Feed Disrupted / Gagal Memuat Stream"}
          </h3>
          <p className="mt-1 max-w-md font-sans text-xs text-muted-foreground">
            {isNotFound
              ? "Sumber video untuk episode ini belum tersedia di server mirror. Silakan coba episode lain dari rak atau jelajahi judul lainnya."
              : `Sumber siaran untuk Reel #${currentEpNum} sedang tidak dapat dijangkau. Silakan muat ulang atau pilih reel lain.`}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {totalEpisodes > 1 && (onNextEpisode || onPrevEpisode) && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (currentEpNum < totalEpisodes && onNextEpisode) {
                    onNextEpisode();
                  } else if (onPrevEpisode) {
                    onPrevEpisode();
                  }
                }}
                className="gap-1.5 border-hairline bg-surface-2 font-mono text-xs hover:border-gold hover:text-gold"
              >
                <Film className="size-3.5 text-gold" />
                <span>Cari Episode Lain</span>
              </Button>
            )}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-1.5 border-hairline bg-surface-2 font-mono text-xs hover:border-gold hover:text-gold"
            >
              <Link href="/anime">
                <Film className="size-3.5" />
                <span>Jelajahi Judul Lain</span>
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => retryStream()}
              className="gap-1.5 border-hairline bg-surface-2 font-mono text-xs hover:border-gold hover:text-gold"
            >
              <RotateCcw className="size-3.5" />
              <span>Muat Ulang</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !streamInfo?.sources || streamInfo.sources.length === 0 || !vidSrc || !playerSrc) {
    return (
      <div className={className}>
        <SkeletonMediaPlayer className={className} />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Viewfinder Video Player Stage */}
      <div className="obi-frame-corners relative aspect-video w-full overflow-hidden rounded-sm border border-hairline bg-[#0d0c0a] shadow-sleeve">
        <MediaPlayer
          className="relative h-full w-full overflow-hidden bg-black"
          autoPlay
          ref={playerRef}
          title={`${title} - Reel #${currentEpNum}`}
          src={playerSrc}
          load="eager"
          crossOrigin
          playsInline
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onSeeked={() => setIsBuffering(false)}
          onPause={() => setIsBuffering(false)}
          onEnded={() => {
            setIsBuffering(false);
            if (autoNext && onNextEpisode) {
              onNextEpisode();
            }
          }}
          onProviderChange={(provider) => {
            if (isHLSProvider(provider)) {
              provider.library = Hls;
              provider.config = {
                lowLatencyMode: false,
                enableWorker: true,
                maxBufferLength: 60,
                maxMaxBufferLength: 120,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                backBufferLength: 60,
                fragLoadingTimeOut: 25000,
                fragLoadingMaxRetry: 6,
                fragLoadingRetryDelay: 1000,
                manifestLoadingTimeOut: 20000,
                manifestLoadingMaxRetry: 4,
                levelLoadingTimeOut: 20000,
                levelLoadingMaxRetry: 4,
                renderTextTracksNatively: false,
              };
            }
          }}
          onCanPlay={() => {
            setIsBuffering(false);
            if (pendingSeekRef.current !== null && playerRef.current) {
              const target = pendingSeekRef.current;
              pendingSeekRef.current = null;
              playerRef.current.currentTime = target;
            }
          }}
          onTimeUpdate={handleTimeUpdate}
        >
          <MediaProvider>
            {subtitles
              .filter((sub) => Boolean(sub.url || sub.file))
              .map((sub, idx) => (
                <Track
                  key={`${episodeId}-sub-${sub.language || sub.label}-${idx}`}
                  src={(sub.url || sub.file)!}
                  kind={(sub.kind as "subtitles" | "captions") || "subtitles"}
                  label={sub.label || "English"}
                  lang={sub.language || "en"}
                  default={sub.default ?? idx === 0}
                  type="vtt"
                />
              ))}
            {chaptersVtt && (
              <Track
                key={`${episodeId}-chapters`}
                src={chaptersVtt}
                kind="chapters"
                default
              />
            )}
          </MediaProvider>

          {/* Double-tap Gestures on Mobile for -10s / +10s */}
          <Gesture
            className="absolute inset-y-0 left-0 z-10 block h-full w-1/4"
            event="dblpointerup"
            action="seek:-10"
          />
          <Gesture
            className="absolute inset-y-0 right-0 z-10 block h-full w-1/4"
            event="dblpointerup"
            action="seek:10"
          />

          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>

        {/* Clean Frame-Freeze Buffering Indicator (no poster/alt image ever shown) */}
        {isBuffering && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/25">
            <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-[#0d0c0a] px-3.5 py-1.5 font-mono text-xs font-bold text-gold shadow-sleeve">
              <Loader2 className="size-4 animate-spin text-gold" />
              <span>Memuat siaran...</span>
            </div>
          </div>
        )}

        {/* Floating Auto-Detected Skip Intro / Outro / Recap Prompt inside Viewfinder */}
        {(inRecapWindow || inIntroWindow || inOutroWindow) && (
          <div className="absolute bottom-14 right-3 z-30 animate-in fade-in slide-in-from-right-3 duration-200 sm:bottom-16 sm:right-4">
            <Button
              type="button"
              onClick={handleSkipIntro}
              className="flex h-auto items-center gap-1.5 rounded-sm border border-gold bg-[#0d0c0a] px-3.5 py-1.5 font-mono text-xs font-bold text-gold shadow-sleeve transition-transform hover:scale-105 hover:bg-gold hover:text-[#0d0c0a] active:scale-95"
            >
              <FastForward className="size-3.5" />
              <span>
                {inRecapWindow
                  ? `Skip Recap (${skipTime?.recap ? formatSeconds(skipTime.recap.end) : ""})`
                  : inOutroWindow
                    ? `Skip Ending (${skipTime?.outro ? formatSeconds(skipTime.outro.end) : ""})`
                    : `Skip Intro (${skipTime?.intro ? formatSeconds(skipTime.intro.end) : ""})`}
              </span>
            </Button>
          </div>
        )}

        {/* Transient Flash Feedback Pill (e.g. +10s, -10s, Skip OP, Subtitles) */}
        {flashNotice && (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex items-center justify-center animate-in fade-in zoom-in-95 duration-150 sm:top-4">
            <div className="flex items-center gap-1.5 rounded-full border border-gold/50 bg-[#0d0c0a] px-3.5 py-1.5 font-mono text-[11px] font-bold text-gold shadow-lg sm:px-4 sm:py-2 sm:text-xs">
              {flashNotice.includes("-") ? (
                <RotateCcw className="size-3.5" />
              ) : flashNotice.includes("+") ? (
                <RotateCw className="size-3.5" />
              ) : flashNotice.includes("Skip") ? (
                <FastForward className="size-3.5" />
              ) : null}
              <span>{flashNotice}</span>
            </div>
          </div>
        )}

        {/* Resume Position Pill Prompt (Top-left HUD so it never blocks center play or bottom controls on mobile) */}
        {resumePrompt && (
          <div className="absolute top-2.5 left-2.5 z-30 flex w-fit max-w-[calc(100%-20px)] items-center justify-start gap-2.5 rounded-sm border border-gold/40 bg-[#0d0c0a] px-2.5 py-1.5 font-mono text-[11px] text-[#f2ece1] shadow-lg animate-in fade-in slide-in-from-top-2 sm:top-3 sm:left-3 sm:max-w-none sm:px-3 sm:text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <History className="size-3.5 shrink-0 text-gold" />
              <span className="truncate">
                Resumed <strong className="text-gold">{formatSeconds(resumePrompt.time)}</strong>
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2 border-l border-hairline/60 pl-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRestartBeginning}
                className="h-auto p-0 font-bold text-gold underline underline-offset-2 hover:bg-transparent hover:text-amber-300"
              >
                Restart
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setResumePrompt(null)}
                className="size-4 p-0 text-[#f2ece1]/70 hover:bg-transparent hover:text-[#f2ece1]"
                title="Dismiss"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Criterion Screening Deck */}
      <AnimeScreeningDeck
        currentEp={currentEpNum}
        totalEpisodes={totalEpisodes}
        sources={streamInfo.sources}
        activeQuality={activeQuality}
        onQualityChange={handleQualityChange}
        subtitles={subtitles}
        activeSubtitle={activeSubtitle}
        onSubtitleChange={handleSubtitleChange}
        onPrevReel={onPrevEpisode}
        onNextReel={onNextEpisode}
        autoNext={Boolean(autoNext)}
        onToggleAutoNext={onToggleAutoNext || (() => {})}
        onSeek={handleSeek}
        onSkipIntro={handleSkipIntro}
        skipLabel={deckSkipLabel}
        playbackSpeed={playbackSpeed}
        onSpeedChange={handleSpeedChange}
        onTogglePiP={handleTogglePiP}
        theaterMode={theaterMode}
        onToggleTheaterMode={onToggleTheaterMode}
        onOpenShortcuts={onOpenShortcuts}
      />
    </div>
  );
};

export default Media;
