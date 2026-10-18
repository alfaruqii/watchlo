import { NextRequest, NextResponse } from "next/server";
import { MangaService } from "@/services";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const subtype = searchParams.get("subtype") || "all";
  const rawSize = parseInt(searchParams.get("size") || "20", 10);
  const size = Number.isFinite(rawSize) ? Math.min(Math.max(rawSize, 1), 40) : 20;

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data } = await MangaService.searchManga(query, subtype, 1, size);
    return NextResponse.json(data?.data || data || { results: [] }, {
      headers: {
        "Cache-Control":
          "public, max-age=120, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error searching manga:", error);
    return NextResponse.json(
      { error: "Failed to search manga" },
      { status: 500 }
    );
  }
}
