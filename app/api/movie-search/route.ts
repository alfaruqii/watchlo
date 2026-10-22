import { NextRequest, NextResponse } from "next/server";
import { MovieService } from "@/services";
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
    const { data } = await MovieService.searchMovie(query);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=120, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Failed to search movie", error);
    return NextResponse.json(
      { error: "Failed to search movie" },
      { status: 500 }
    );
  }
}
