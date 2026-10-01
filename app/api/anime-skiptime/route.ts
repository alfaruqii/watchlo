import { NextRequest, NextResponse } from "next/server";
import { AnimeServiceV2 } from "@/services";

export async function GET(request: NextRequest) {
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
    return NextResponse.json(data);
  } catch (error: unknown) {
    // If not found or error, return graceful found: false response so player uses fallback smoothly
    return NextResponse.json(
      { found: false, message: "No skip time available for this episode" },
      { status: 200 }
    );
  }
}
