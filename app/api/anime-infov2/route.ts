import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV2 } from "@/services";
import { botDeniedResponse, isVerifiedHuman } from "@/lib/botCheck";

export async function GET(request: NextRequest) {
  if (!(await isVerifiedHuman())) {
    return botDeniedResponse();
  }

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
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to give animev2 info", error);
    return NextResponse.json(
      { error: "Failed to give animev2 info" },
      { status: 500 }
    );
  }
}
