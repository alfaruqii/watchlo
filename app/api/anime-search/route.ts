import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV2 } from "@/services";
import { botDeniedResponse, isVerifiedHuman } from "@/lib/botCheck";

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=120, s-maxage=600, stale-while-revalidate=3600",
};

export async function GET(request: NextRequest) {
  if (!(await isVerifiedHuman())) {
    return botDeniedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const genre = searchParams.get("genre");

  if (!query && !genre) {
    return NextResponse.json(
      { error: "Query or genre parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (genre) {
      const { data } = await AnimeServiceV2.advancedSearchAnime({
        genres: [genre],
        size: 24,
        sort: ["TRENDING_DESC", "POPULARITY_DESC"],
      });
      return NextResponse.json(data, { headers: CACHE_HEADERS });
    }

    const { data } = await AnimeServiceV2.searchAnimeV2(query as string);
    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch (error) {
    console.error("Error searching animev2:", error);
    return NextResponse.json(
      { error: "Failed to search animev2" },
      { status: 500 }
    );
  }
}
