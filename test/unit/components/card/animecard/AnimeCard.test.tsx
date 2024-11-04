import { render, screen } from "@testing-library/react";
import AnimeCard from "@/components/card/animecard/AnimeCard";
import { popularAnime, recentAnime } from "test/fixture/info/anime.fixture";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    const style = fill
      ? {
          objectFit: "cover",
          position: "absolute",
          height: "100%",
          width: "100%",
        }
      : {};
    return <img data-testid="mock-image" {...rest} style={style} />;
  },
}));

describe("AnimeCard", () => {
  test("renders popular anime correctly", () => {
    render(<AnimeCard anime={popularAnime} />);

    expect(screen.getByText("Shingeki no Kyojin")).toBeInTheDocument();
    // Check the small info
    expect(screen.getByText("2013")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("8.4")).toBeInTheDocument();

    // Use stringContaining to match part of the transformed URL
    const popularImage = screen.getByAltText("Shingeki no Kyojin");
    expect(popularImage).toHaveAttribute(
      "src",
      expect.stringContaining(
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-73IhOXpJZiMF.jpg"
      )
    );
  });

  test("renders recent anime correctly", () => {
    render(<AnimeCard anime={recentAnime} />);

    expect(
      screen.getByText("Blue Lock: Episode Nagi - Additional Time!")
    ).toBeInTheDocument();

    // Check the small info
    expect(screen.getByText("Episode 1")).toBeInTheDocument();

    const recentAnimeImage = screen.getByAltText(
      "Blue Lock: Episode Nagi - Additional Time!"
    );
    expect(recentAnimeImage).toHaveAttribute(
      "src",
      expect.stringContaining(
        "https://gogocdn.net/cover/blue-lock-episode-nagi-additional-time.png"
      )
    );
  });

  test("generates correct link for popular anime", () => {
    const { container } = render(<AnimeCard anime={popularAnime} />);

    const link = container.querySelector("a");
    // must have the correct id
    expect(link).toHaveAttribute("href", "/anime/detail/16498");
  });

  test("generates correct link for recentAnime anime", () => {
    const { container } = render(<AnimeCard anime={recentAnime} />);

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "/anime/watch?id=blue-lock&ep=1");
  });
});
