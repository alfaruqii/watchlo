import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV1, AnimeServiceV2 } from "@/services";
import { getEnv } from "@/utils/getEnv";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const id = searchParams.get("id");
  const ep = searchParams.get("ep");
  const provider = searchParams.get("provider") || undefined;
  const dub = searchParams.get("dub") === "true";

  if (!query && !id) {
    return NextResponse.json(
      { error: "Query or id parameter is required" },
      { status: 400 }
    );
  }

  interface SubtitleTrack {
    url?: string;
    file?: string;
    label?: string;
    language?: string;
    kind?: string;
    default?: boolean;
    [key: string]: unknown;
  }

  interface SourceTrack {
    url: string;
    quality?: string;
    isM3U8?: boolean;
    [key: string]: unknown;
  }

  interface StreamPayload {
    headers?: { Referer?: string; [key: string]: unknown };
    subtitles?: SubtitleTrack[];
    tracks?: SubtitleTrack[];
    sources?: SourceTrack[];
    streams?: SourceTrack[];
    provider?: string;
    info?: Record<string, unknown>;
    [key: string]: unknown;
  }

  try {
    let data: StreamPayload | null = null;

    // 1. If id & ep provided, try V2 multiStream first (automatic 18+ HStream routing, multi-res, etc.)
    if (id && ep) {
      try {
        const cleanWatchId =
          query && !query.includes("-tv-ver") && !query.includes("-tv")
            ? query
            : undefined;
        const resV2 = await AnimeServiceV2.getAnimeStreamV2({
          id,
          ep,
          watchId: cleanWatchId,
          provider,
          dub,
        });
        data = resV2.data;
      } catch {
        // Fall back below
      }
    }

    // 2. If no data yet and query exists, try V1 (Gogo) or V2 watchId fallback
    if (!data && query) {
      try {
        const resV1 = await AnimeServiceV1.getAnimeStreamGogo(query);
        data = resV1.data;
      } catch {
        // Fallback to V2 stream/multi
        const resV2 = await AnimeServiceV2.getAnimeStreamV2({
          watchId: query,
          id: id || undefined,
          ep: ep || undefined,
          provider,
          dub,
        });
        data = resV2.data;
      }
    }

    // 3. If still no data and id exists, try V2 with default ep=1
    if (!data && id) {
      try {
        const resV2 = await AnimeServiceV2.getAnimeStreamV2({
          id,
          ep: ep || 1,
          provider,
          dub,
        });
        data = resV2.data;
      } catch {
        // Leave data null
      }
    }

    const referer = data?.headers?.Referer || "https://megaplay.buzz/";
    const apiV2 =
      getEnv("WATCHLO_API_V2") ??
      (getEnv("WATCHLO_ANIME_API") ? `${getEnv("WATCHLO_ANIME_API")}/v2` : "");

    // Normalize subtitle tracks from data.subtitles or data.tracks
    const rawSubs: SubtitleTrack[] = Array.isArray(data?.subtitles)
      ? data.subtitles
      : Array.isArray(data?.tracks)
        ? data.tracks
        : [];

    if (data && rawSubs.length > 0) {
      const subProxyBase = "/api/subtitles";
      const normalizedSubs: SubtitleTrack[] = rawSubs.map(
        (sub: SubtitleTrack, idx: number): SubtitleTrack => {
          const rawSubUrl = sub.url || sub.file || "";
          const isAlreadyProxied =
            rawSubUrl.includes("/api/subtitles") ||
            rawSubUrl.includes("/proxy/subtitle") ||
            rawSubUrl.includes("proxy/subtitle.vtt");
          const proxiedSubUrl =
            rawSubUrl && !isAlreadyProxied
              ? `${subProxyBase}?url=${encodeURIComponent(rawSubUrl)}&referer=${encodeURIComponent(referer)}`
              : rawSubUrl;
          return {
            ...sub,
            label: sub.label || sub.language || `Track ${idx + 1}`,
            url: proxiedSubUrl,
            file: proxiedSubUrl,
            default: sub.default ?? idx === 0,
          };
        }
      );

      // Check if an Indonesian subtitle track already exists
      const hasIndo = normalizedSubs.some((s: SubtitleTrack) =>
        /indonesian|bahasa|indo/i.test(String(s.label || s.language || ""))
      );

      if (!hasIndo) {
        const engSub =
          normalizedSubs.find((s: SubtitleTrack) =>
            /english/i.test(String(s.label || s.language || ""))
          ) || normalizedSubs[0];

        if (engSub?.url) {
          const autoIndoUrl = `/api/subtitle-id?url=${encodeURIComponent(engSub.url)}`;
          normalizedSubs.push({
            url: autoIndoUrl,
            file: autoIndoUrl,
            label: "Indonesian (Auto)",
            language: "id",
            kind: "subtitles",
            default: false,
          });
        }
      }

      // Sort so English and Indonesian tracks always appear first in the menu
      const getPriority = (label: string) => {
        const l = label.toLowerCase();
        if (l === "english") return 0;
        if (l.includes("indonesian") || l.includes("indo")) return 1;
        if (l.startsWith("english")) return 2;
        return 10;
      };

      normalizedSubs.sort(
        (a: SubtitleTrack, b: SubtitleTrack) =>
          getPriority(String(a.label || "")) -
          getPriority(String(b.label || ""))
      );

      data.subtitles = normalizedSubs;
    }

    // Normalize sources/streams from data.sources or data.streams (V2 uses streams, V1 uses sources)
    const rawSources = Array.isArray(data?.sources)
      ? data.sources
      : Array.isArray(data?.streams)
        ? data.streams
        : [];

    if (data && rawSources.length > 0) {
      const proxyBase = apiV2 ? `${apiV2}/proxy/hls` : "";
      const hasDirectSubtitles = Array.isArray(data.subtitles) && data.subtitles.length > 0;

      data.sources = rawSources.map((s: SourceTrack) => {
        let finalUrl = s.url || "";
        const isM3U8 = s.isM3U8 !== undefined ? Boolean(s.isM3U8) : finalUrl.includes(".m3u8");

        // Only route HLS (.m3u8) through proxyBase. Direct MP4 (e.g. HStream) has native CORS and must not be proxied through /proxy/hls
        if (isM3U8 && finalUrl && !finalUrl.includes("/proxy/hls") && proxyBase) {
          finalUrl = `${proxyBase}?url=${encodeURIComponent(finalUrl)}&referer=${encodeURIComponent(referer)}`;
        }
        // Strip &subs= from master.m3u8 when direct VTT <Track> subtitles are present to prevent double-rendered cues
        if (hasDirectSubtitles && finalUrl.includes("&subs=")) {
          finalUrl = finalUrl.replace(/&subs=[^&]*/g, "");
        }
        return {
          ...s,
          url: finalUrl,
          isM3U8,
          quality: s.quality || (isM3U8 ? "auto" : "720p"),
        };
      });
    }

    if (!data || !data.sources || data.sources.length === 0) {
      return NextResponse.json(
        {
          error: "Stream sources not found for this anime episode",
          message: "Sumber video untuk episode ini belum tersedia di server mirror.",
          code: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to give anime stream", error);
    return NextResponse.json(
      { error: "Failed to fetch anime stream" },
      { status: 500 }
    );
  }
}
