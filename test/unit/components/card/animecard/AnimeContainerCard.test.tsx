// AnimeContainerCard.test.tsx
// Ensure Zustand’s store state is reset between tests
import { storeResetFns } from "__mocks__/zustand";
import { render, screen } from "@testing-library/react";
import AnimeContainerCard from "@/components/card/animecard/AnimeContainerCard";
import { useThemeStore } from "@/store/themeStore";
import { popularAnime, recentAnime } from "test/fixture/info/anime.fixture";
import { AnimeType } from "@/types/anime.type";

// Mock AnimeCard to isolate AnimeContainerCard tests
jest.mock(
  "@/components/card/animecard/AnimeCard",
  () =>
    ({ anime }: { anime: AnimeType }) => {
      const title =
        typeof anime.title === "object"
          ? anime.title.userPreferred ||
            anime.title.romaji ||
            anime.title.english ||
            anime.title.native
          : anime.title;

      return <div data-testid="anime-card">{title}</div>;
    }
);

beforeEach(() => {
  // Reset all Zustand stores before each test
  storeResetFns.forEach((resetFn) => resetFn());

  // Set an initial state for the theme store
  useThemeStore.setState({ theme: "black", setTheme: jest.fn() });
});

describe("AnimeContainerCard Component", () => {
  const containerTitle = "Recommended Animes";

  it("renders the container title correctly", () => {
    render(
      <AnimeContainerCard
        animes={[popularAnime]}
        containerTitle={containerTitle}
      />
    );
    expect(screen.getByText(containerTitle)).toBeInTheDocument();
  });

  it("renders container title and editions counter", () => {
    render(
      <AnimeContainerCard
        animes={[popularAnime]}
        containerTitle={containerTitle}
      />
    );
    expect(screen.getByText(containerTitle)).toBeInTheDocument();
    expect(screen.getByText("1 EDITIONS")).toBeInTheDocument();
  });

  it("renders a list of AnimeCard components", () => {
    const animes = [popularAnime, recentAnime];
    render(
      <AnimeContainerCard animes={animes} containerTitle={containerTitle} />
    );
    const animeCards = screen.getAllByTestId("anime-card");
    expect(animeCards).toHaveLength(animes.length);
  });

  it("handles empty anime list without errors", () => {
    render(<AnimeContainerCard animes={[]} containerTitle={containerTitle} />);
    const titleElement = screen.getByText(containerTitle);
    expect(titleElement).toBeInTheDocument();
    expect(screen.queryByTestId("anime-card")).toBeNull();
  });
});
