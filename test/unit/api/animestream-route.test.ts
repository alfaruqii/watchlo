/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET as getAnimeStream } from "@/api/animestream/route";
import { AnimeServiceV1, AnimeServiceV2 } from "@/services";

jest.mock("@/services", () => ({
  AnimeServiceV1: {
    getAnimeStreamGogo: jest.fn(),
  },
  AnimeServiceV2: {
    getAnimeStreamV2: jest.fn(),
  },
}));

const animeServiceV1Mock = AnimeServiceV1 as jest.Mocked<typeof AnimeServiceV1>;
const animeServiceV2Mock = AnimeServiceV2 as jest.Mocked<typeof AnimeServiceV2>;

describe("GET /api/animestream", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when both query and id are missing", async () => {
    const request = new NextRequest("http://localhost/api/animestream");
    const response = await getAnimeStream(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Query or id parameter is required" });
  });

  it("returns 200 with direct MP4 stream for adult anime", async () => {
    animeServiceV2Mock.getAnimeStreamV2.mockResolvedValueOnce({
      data: {
        code: 200,
        provider: "hstream",
        streams: [
          {
            url: "https://cdn.example.com/video.mp4",
            quality: "720p",
            isM3U8: false,
            label: "HStream 720p Direct MP4",
          },
        ],
        subtitles: [
          {
            url: "https://cdn.example.com/sub.vtt",
            label: "English",
            language: "en",
            default: true,
          },
        ],
      },
    } as any);

    const request = new NextRequest(
      "http://localhost/api/animestream?id=113417&ep=1"
    );
    const response = await getAnimeStream(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.sources).toBeDefined();
    expect(body.sources[0].isM3U8).toBe(false);
    expect(body.sources[0].quality).toBe("720p");
    expect(body.subtitles[0].label).toBe("English");
  });

  it("returns 404 when upstream sources are empty or not found", async () => {
    animeServiceV2Mock.getAnimeStreamV2.mockRejectedValue(new Error("Not found"));
    animeServiceV1Mock.getAnimeStreamGogo.mockRejectedValue(new Error("Not found"));

    const request = new NextRequest(
      "http://localhost/api/animestream?id=130058&ep=1"
    );
    const response = await getAnimeStream(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.code).toBe(404);
    expect(body.message).toBe(
      "Sumber video untuk episode ini belum tersedia di server mirror."
    );
  });
});
