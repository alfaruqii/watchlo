import { NextRequest, NextResponse } from "next/server";
import { MangaService } from "@/services";

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=120, s-maxage=600, stale-while-revalidate=3600",
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawSubtype = searchParams.get("subtype");
  const subtype =
    rawSubtype === "manhwa" || rawSubtype === "manga" || rawSubtype === "manhua"
      ? rawSubtype
      : "all";

  try {
    const [trendingSettled, popularSettled] = await Promise.allSettled([
      MangaService.getTrendingManga(subtype, 1, 15),
      MangaService.getPopularManga(subtype, 1, 20),
    ]);

    const trending =
      trendingSettled.status === "fulfilled"
        ? trendingSettled.value.data?.data?.results ||
          trendingSettled.value.data?.results ||
          []
        : [];

    const popular =
      popularSettled.status === "fulfilled"
        ? popularSettled.value.data?.data?.results ||
          popularSettled.value.data?.results ||
          []
        : [];

    return NextResponse.json(
      { trending, popular },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Error fetching manga list:", error);
    return NextResponse.json(
      { error: "Failed to fetch manga list" },
      { status: 500 }
    );
  }
}
