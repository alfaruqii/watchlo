import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV2 } from "@/services";
import { botDeniedResponse, isVerifiedHuman } from "@/lib/botCheck";

export async function GET(request: NextRequest) {
  if (!(await isVerifiedHuman())) {
    return botDeniedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const ep = searchParams.get("ep");

  if (!id || !ep) {
    return NextResponse.json(
      { error: "Query parameters 'id' and 'ep' are required" },
      { status: 400 }
    );
  }

  try {
    const { data } = await AnimeServiceV2.getSkipTime(id, ep);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=600, s-maxage=43200, stale-while-revalidate=604800",
      },
    });
  } catch (error: unknown) {
    // If not found or error, return graceful found: false response so player uses fallback smoothly
    return NextResponse.json(
      { found: false, message: "No skip time available for this episode" },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }
}
