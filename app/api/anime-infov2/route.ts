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
    const { data } = await AnimeServiceV2.getAnimeInfoV2(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to give animev2 info", error);
    return NextResponse.json(
      { error: "Failed to give animev2 info" },
      { status: 500 }
    );
  }
}
