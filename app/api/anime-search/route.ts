import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV2 } from "@/services";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data } = await AnimeServiceV2.searchAnimeV2(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching animev2:", error);
    return NextResponse.json(
      { error: "Failed to search animev2" },
      { status: 500 }
    );
  }
}
