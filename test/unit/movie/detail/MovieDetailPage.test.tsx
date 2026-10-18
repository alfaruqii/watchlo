import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DetailPage from "@/movie/detail/[id]/page";
import { MovieService } from "@/services";

jest.mock("@/services", () => ({
  MovieService: {
    getMoviesById: jest.fn(),
    getMovieTrailer: jest.fn(),
    getMovieReviews: jest.fn(),
    getMovieSimilar: jest.fn(),
    getMovieRecommendations: jest.fn(),
    getMovieCredits: jest.fn(),
  },
}));

jest.mock("@/components/detail/banner/Banner", () => () => <div>Banner</div>);
jest.mock("@/components/detail/cardbanner/CardBanner", () => () => <div>CardBanner</div>);
jest.mock("@/components/detail/infodetails/InfoDetails", () => () => <div>InfoDetails</div>);
jest.mock("@/components/media/Trailer", () => () => <div>Trailer</div>);
jest.mock("@/components/media/Embeded", () => () => <div>Embeded</div>);
jest.mock("@/components/reviews/ReviewsComponent", () => () => <div>Reviews</div>);
jest.mock("@/components/skeleton/SkeletonEpisodes", () => () => <div>Skeleton</div>);
jest.mock("@/components/card/moviescard/MoviesContainterCard", () => ({
  MoviesContainerCard: ({ containerTitle }: { containerTitle: string }) => (
    <div>{containerTitle}</div>
  ),
}));

const movieServiceMock = MovieService as jest.Mocked<typeof MovieService>;

describe("Movie detail page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    movieServiceMock.getMoviesById.mockResolvedValue({ data: { id: 1, title: "Movie" } } as any);
    movieServiceMock.getMovieTrailer.mockResolvedValue({
      data: { results: [{ id: "trailer-1", type: "Trailer", key: "abc" }] },
    } as any);
    movieServiceMock.getMovieReviews.mockResolvedValue({ data: { results: [] } } as any);
    movieServiceMock.getMovieCredits.mockResolvedValue({
      data: { cast: [], crew: [] },
    } as any);
  });

  it("renders recommendations and similar sections when results are available", async () => {
    movieServiceMock.getMovieRecommendations.mockResolvedValue({
      data: { results: [{ id: 11, title: "Rec A" }] },
    } as any);
    movieServiceMock.getMovieSimilar.mockResolvedValue({
      data: { results: [{ id: 12, title: "Similar A" }] },
    } as any);

    const ui = await DetailPage({ params: Promise.resolve({ id: "1" }) });
    render(ui);

    expect(screen.getByText("Curated Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Similar Archival Editions")).toBeInTheDocument();
  });

  it("does not render recommendations and similar sections when results are empty", async () => {
    movieServiceMock.getMovieRecommendations.mockResolvedValue({
      data: { results: [] },
    } as any);
    movieServiceMock.getMovieSimilar.mockResolvedValue({
      data: { results: [] },
    } as any);

    const ui = await DetailPage({ params: Promise.resolve({ id: "1" }) });
    render(ui);

    expect(screen.queryByText("Recommendations 👌")).not.toBeInTheDocument();
    expect(screen.queryByText("Similar 📍")).not.toBeInTheDocument();
  });
});