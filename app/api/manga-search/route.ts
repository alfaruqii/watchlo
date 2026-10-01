import { NextRequest, NextResponse } from "next/server";
import { MangaService } from "@/services";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const subtype = searchParams.get("subtype") || "all";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data } = await MangaService.searchManga(query, subtype, 1, 20);
    return NextResponse.json(data?.data || data || { results: [] });
  } catch (error) {
    console.error("Error searching manga:", error);
    return NextResponse.json(
      { error: "Failed to search manga" },
      { status: 500 }
    );
  }
}
