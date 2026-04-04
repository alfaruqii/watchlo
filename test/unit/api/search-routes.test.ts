/**
 * @jest-environment node
 */

import "@testing-library/jest-dom";
import { NextRequest } from "next/server";
import { GET as getMovieSearch } from "@/api/movie-search/route";
import { GET as getAnimeSearch } from "@/api/anime-search/route";
import { MovieService, AnimeServiceV2 } from "@/services";

jest.mock("@/services", () => ({
  MovieService: {
    searchMovie: jest.fn(),
  },
  AnimeServiceV2: {
    searchAnimeV2: jest.fn(),
  },
}));

const movieServiceMock = MovieService as jest.Mocked<typeof MovieService>;
const animeServiceMock = AnimeServiceV2 as jest.Mocked<typeof AnimeServiceV2>;

describe("API search routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when movie-search query is missing", async () => {
    const request = new NextRequest("http://localhost/api/movie-search");

    const response = await getMovieSearch(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Query parameter is required" });
  });

  it("returns movie search data when query is valid", async () => {
    movieServiceMock.searchMovie.mockResolvedValue({
      data: { results: [{ id: 1, title: "Inception" }] },
    } as any);

    const request = new NextRequest(
      "http://localhost/api/movie-search?query=inception"
    );
    const response = await getMovieSearch(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(movieServiceMock.searchMovie).toHaveBeenCalledWith("inception");
    expect(body).toEqual({ results: [{ id: 1, title: "Inception" }] });
  });

  it("returns 500 when movie search service throws", async () => {
    movieServiceMock.searchMovie.mockRejectedValue(new Error("boom"));

    const request = new NextRequest("http://localhost/api/movie-search?query=x");
    const response = await getMovieSearch(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Failed to search movie" });
  });

  it("returns 400 when anime-search query is missing", async () => {
    const request = new NextRequest("http://localhost/api/anime-search");

    const response = await getAnimeSearch(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Query parameter is required" });
  });

  it("returns anime search data when query is valid", async () => {
    animeServiceMock.searchAnimeV2.mockResolvedValue({
      data: { results: [{ id: 2, title: "Naruto" }] },
    } as any);

    const request = new NextRequest(
      "http://localhost/api/anime-search?query=naruto"
    );
    const response = await getAnimeSearch(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(animeServiceMock.searchAnimeV2).toHaveBeenCalledWith("naruto");
    expect(body).toEqual({ results: [{ id: 2, title: "Naruto" }] });
  });

  it("returns 500 when anime search service throws", async () => {
    animeServiceMock.searchAnimeV2.mockRejectedValue(new Error("boom"));

    const request = new NextRequest("http://localhost/api/anime-search?query=x");
    const response = await getAnimeSearch(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Failed to search animev2" });
  });
});