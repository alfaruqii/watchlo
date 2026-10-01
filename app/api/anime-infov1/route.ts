import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV1, AnimeServiceV2 } from "@/services";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const title = searchParams.get("title") || undefined;
  const anilistId = searchParams.get("id") || searchParams.get("anilistId") || undefined;

  if (!query && !anilistId) {
    return NextResponse.json(
      { error: "Query or id parameter is required" },
      { status: 400 }
    );
  }

  const formatV2Episodes = (eps: Array<{ id: string; number?: number; episode?: number; title?: string }>, targetId: string) => {
    return eps.map((ep) => ({
      id: ep.id,
      number: Number(ep.number ?? ep.episode ?? 1),
      title: ep.title || `Episode ${ep.number ?? ep.episode ?? 1}`,
      url: `/anime/watch?id=${encodeURIComponent(targetId)}&ep=${ep.number ?? ep.episode ?? 1}`,
    }));
  };

  const effectiveId = anilistId || (query && /^\d+$/.test(query) ? query : undefined);
  const isAdult = searchParams.get("isAdult") === "true";
  const imageParam = searchParams.get("image") || undefined;
  const cleanTitle = title
    ? title
        .split("|||")
        .map((t) => t.trim())
        .find(Boolean) || undefined
    : undefined;

  const resolveTitleAndCover = async (
    targetId: string
  ): Promise<{ title: string; image: string }> => {
    let cover = imageParam && imageParam.trim() ? imageParam : "";
    let resolvedTitle = cleanTitle || "";
    try {
      const infoRes = await AnimeServiceV2.getAnimeInfoV2(targetId);
      if (!cover) {
        cover =
          infoRes.data?.coverImage?.extraLarge ||
          infoRes.data?.coverImage?.large ||
          infoRes.data?.coverImage?.medium ||
          "";
      }
      if (!resolvedTitle) {
        const tObj = infoRes.data?.title;
        resolvedTitle =
          (typeof tObj === "object"
            ? tObj?.userPreferred || tObj?.english || tObj?.romaji || tObj?.native
            : tObj) || "";
      }
    } catch {
      // ignore
    }
    return { title: resolvedTitle, image: cover };
  };

  try {
    let data: Record<string, unknown> | null = null;

    // For adult anime, bypass V1 Gogo to ensure uncut full episodes from V2/HStream
    if (isAdult && effectiveId) {
      try {
        const v2Res = await AnimeServiceV2.getAnimeEpisodesV2(effectiveId);
        const rawEps = v2Res.data?.episodes || (Array.isArray(v2Res.data) ? v2Res.data : []);
        if (Array.isArray(rawEps) && rawEps.length > 0) {
          const { title: resolvedTitle, image: cover } =
            await resolveTitleAndCover(String(effectiveId));
          data = {
            id: String(effectiveId),
            title: resolvedTitle || cleanTitle || query || String(effectiveId),
            image: cover,
            episodes: formatV2Episodes(rawEps, String(effectiveId)),
            totalEpisodes: rawEps.length,
          };
        }
      } catch {
        // Fall back to V1 if V2 fails
      }
    }

    if (!data && query) {
      try {
        const res = await AnimeServiceV1.getAnimeInfoV1Gogo(query, title);
        data = res.data;
      } catch {
        data = null;
      }
    }

    // If V1 has no episodes or failed, and we have an anilist ID, check V2 episode endpoint
    const episodes = Array.isArray(data?.episodes) ? (data.episodes as unknown[]) : [];
    if (episodes.length === 0 && effectiveId) {
      try {
        const v2Res = await AnimeServiceV2.getAnimeEpisodesV2(effectiveId);
        const rawEps = v2Res.data?.episodes || (Array.isArray(v2Res.data) ? v2Res.data : []);
        if (Array.isArray(rawEps) && rawEps.length > 0) {
          const existingImage =
            typeof data?.image === "string" && data.image.trim() ? data.image : "";
          const existingTitle =
            typeof data?.title === "string" && data.title.trim()
              ? data.title.split("|||")[0].trim()
              : "";
          const { title: resolvedTitle, image: cover } =
            await resolveTitleAndCover(String(effectiveId));
          data = {
            ...(data || {}),
            id: data?.id || String(effectiveId),
            title:
              existingTitle ||
              resolvedTitle ||
              cleanTitle ||
              query ||
              String(effectiveId),
            image: existingImage || cover,
            episodes: formatV2Episodes(rawEps, String(effectiveId)),
            totalEpisodes: rawEps.length,
          };
        }
      } catch {
        // Fallback failed, keep data as-is
      }
    }

    if (!data) {
      return NextResponse.json(
        { error: "Anime info not found" },
        { status: 404 }
      );
    }

    if (data && typeof data.title === "string" && data.title.includes("|||")) {
      data.title =
        data.title
          .split("|||")
          .map((t) => t.trim())
          .find(Boolean) || data.title;
    }

    if (data && (!data.image || typeof data.image !== "string" || !data.image.trim())) {
      if (imageParam && imageParam.trim()) {
        data.image = imageParam;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error to give animev1 info:", error);
    return NextResponse.json(
      { error: "Failed to give animev1 info" },
      { status: 500 }
    );
  }
}
