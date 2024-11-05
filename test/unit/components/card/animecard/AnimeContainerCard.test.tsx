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

  it("applies the correct border color for black theme", () => {
    render(
      <AnimeContainerCard
        animes={[popularAnime]}
        containerTitle={containerTitle}
      />
    );
    const titleElement = screen.getByText(containerTitle);
    expect(titleElement).toHaveClass("border-gray-200");
  });

  it("applies the correct border color for white (garden) theme", () => {
    // Update the theme state to simulate a non-garden theme
    useThemeStore.setState({ theme: "garden" });

    render(
      <AnimeContainerCard
        animes={[popularAnime]}
        containerTitle={containerTitle}
      />
    );
    const titleElement = screen.getByText(containerTitle);
    expect(titleElement).toHaveClass("border-black");
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
