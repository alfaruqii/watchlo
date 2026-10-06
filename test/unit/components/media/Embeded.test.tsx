import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Embeded, { generateUrl } from "@/components/media/Embeded";

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button type="button" role="menuitem" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe("generateUrl helper", () => {
  test("generates correct URL for standard path-based movie and tv providers", () => {
    // VidSrc Official
    expect(generateUrl("https://vidsrc.me/embed", "movie", "123")).toBe(
      "https://vidsrc.me/embed/movie/123"
    );
    expect(generateUrl("https://vidsrc.me/embed", "tv", "123", "2", "5")).toBe(
      "https://vidsrc.me/embed/tv/123/2/5"
    );

    // Videasy (.net)
    expect(
      generateUrl("https://player.videasy.net", "movie", "456")
    ).toBe("https://player.videasy.net/movie/456");
    expect(
      generateUrl("https://player.videasy.net", "tv", "456", "1", "3")
    ).toBe("https://player.videasy.net/tv/456/1/3");
  });

  test("generates correct query-param URL for SuperEmbed / multiembed", () => {
    expect(
      generateUrl("https://multiembed.mov", "movie", "1126166", "1", "1", "multiembed")
    ).toBe("https://multiembed.mov/?video_id=1126166&tmdb=1");

    expect(
      generateUrl("https://multiembed.mov", "tv", "1399", "3", "7", "multiembed")
    ).toBe("https://multiembed.mov/?video_id=1399&tmdb=1&s=3&e=7");
  });

  test("generates correct URL for AnyEmbed (SmashyStream)", () => {
    expect(
      generateUrl("https://embed.smashystream.com", "movie", "550", "1", "1", "anyembed")
    ).toBe("https://embed.smashystream.com/playere.php?tmdb=550");

    expect(
      generateUrl("https://embed.smashystream.com", "tv", "1399", "2", "4", "anyembed")
    ).toBe("https://embed.smashystream.com/playere.php?tmdb=1399&season=2&episode=4");
  });

  test("generates correct URL for 2Embed", () => {
    expect(
      generateUrl("https://www.2embed.cc", "movie", "550", "1", "1", "2embed")
    ).toBe("https://www.2embed.cc/embed/550");

    expect(
      generateUrl("https://www.2embed.cc", "tv", "1399", "1", "2", "2embed")
    ).toBe("https://www.2embed.cc/embedtv/1399&s=1&e=2");
  });

  test("appends custom styling parameters for vidlink", () => {
    const movieUrl = generateUrl(
      "https://vidlink.pro",
      "movie",
      "100",
      "1",
      "1",
      "vidlink"
    );
    expect(movieUrl).toContain("https://vidlink.pro/movie/100");
    expect(movieUrl).toContain("primaryColor=f59e0b");
  });
});

describe("Embeded component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders screening room for movie with default provider (SuperEmbed)", () => {
    render(<Embeded id="1126166" type="movie" />);

    expect(screen.getByText("Screening Room — Feature")).toBeInTheDocument();
    expect(screen.getByText(/SOURCE: SuperEmbed/i)).toBeInTheDocument();

    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://multiembed.mov/?video_id=1126166&tmdb=1"
    );
    expect(iframe).toHaveAttribute("referrerpolicy", "origin");
  });

  test("renders screening room for TV series with season and episode title", () => {
    render(<Embeded id="1399" type="tv" season="2" ep="8" />);

    expect(
      screen.getByText("Screening Room — S02 · E08")
    ).toBeInTheDocument();

    const iframe = screen.getByTitle("Watchlo Screening Room 1399");
    expect(iframe).toHaveAttribute(
      "src",
      "https://multiembed.mov/?video_id=1399&tmdb=1&s=2&e=8"
    );
  });

  test("switches provider when selected from dropdown and updates iframe src", () => {
    render(<Embeded id="1126166" type="movie" />);

    const vidsrcOption = screen.getByText(/VidSrc Official \(Fast HD\)/i);
    fireEvent.click(vidsrcOption);

    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toHaveAttribute(
      "src",
      "https://vidsrc.me/embed/movie/1126166"
    );
    expect(localStorage.getItem("watchlo_embed_provider")).toBe("vidsrcme");
  });

  test("restores previously saved provider from localStorage", () => {
    localStorage.setItem("watchlo_embed_provider", "videasy");

    render(<Embeded id="1126166" type="movie" />);

    expect(screen.getByText(/SOURCE: Videasy/i)).toBeInTheDocument();
    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toHaveAttribute(
      "src",
      "https://player.videasy.net/movie/1126166"
    );
  });

  test("resets to default provider when an outdated/decommissioned provider is found in localStorage", () => {
    localStorage.setItem("watchlo_embed_provider", "embedsu");

    render(<Embeded id="1126166" type="movie" />);

    expect(screen.getByText(/SOURCE: SuperEmbed/i)).toBeInTheDocument();
    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toHaveAttribute(
      "src",
      "https://multiembed.mov/?video_id=1126166&tmdb=1"
    );
    expect(localStorage.getItem("watchlo_embed_provider")).toBe("multiembed");
  });
});
