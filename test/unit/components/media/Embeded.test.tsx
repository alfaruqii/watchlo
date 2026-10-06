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
    // Embed.su
    expect(generateUrl("https://embed.su/embed", "movie", "123")).toBe(
      "https://embed.su/embed/movie/123"
    );
    expect(generateUrl("https://embed.su/embed", "tv", "123", "2", "5")).toBe(
      "https://embed.su/embed/tv/123/2/5"
    );

    // AutoEmbed
    expect(
      generateUrl("https://player.autoembed.cc/embed", "movie", "456")
    ).toBe("https://player.autoembed.cc/embed/movie/456");
    expect(
      generateUrl("https://player.autoembed.cc/embed", "tv", "456", "1", "3")
    ).toBe("https://player.autoembed.cc/embed/tv/456/1/3");

    // VidSrc CC
    expect(generateUrl("https://vidsrc.cc/v2/embed", "movie", "789")).toBe(
      "https://vidsrc.cc/v2/embed/movie/789"
    );
  });

  test("generates correct query-param URL for SuperEmbed / multiembed", () => {
    expect(
      generateUrl("https://multiembed.mov", "movie", "1126166", "1", "1", "multiembed")
    ).toBe("https://multiembed.mov/?video_id=1126166&tmdb=1");

    expect(
      generateUrl("https://multiembed.mov", "tv", "1399", "3", "7", "multiembed")
    ).toBe("https://multiembed.mov/?video_id=1399&tmdb=1&s=3&e=7");
  });

  test("generates correct URL for SmashyStream TV and movie", () => {
    expect(
      generateUrl("https://player.smashystream.xyz", "movie", "550", "1", "1", "smashystream")
    ).toBe("https://player.smashystream.xyz/movie/550");

    expect(
      generateUrl("https://player.smashystream.xyz", "tv", "1399", "2", "4", "smashystream")
    ).toBe("https://player.smashystream.xyz/tv/1399?s=2&e=4");
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

  test("renders screening room for movie with default provider", () => {
    render(<Embeded id="1126166" type="movie" />);

    expect(screen.getByText("Screening Room — Feature")).toBeInTheDocument();
    expect(screen.getByText(/SOURCE: Embed.su/i)).toBeInTheDocument();

    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://embed.su/embed/movie/1126166"
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
      "https://embed.su/embed/tv/1399/2/8"
    );
  });

  test("switches provider when selected from dropdown and updates iframe src", () => {
    render(<Embeded id="1126166" type="movie" />);

    const superEmbedOption = screen.getByText(/SuperEmbed \(Indonesian & Asian Movies\)/i);
    fireEvent.click(superEmbedOption);

    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toHaveAttribute(
      "src",
      "https://multiembed.mov/?video_id=1126166&tmdb=1"
    );
    expect(localStorage.getItem("watchlo_embed_provider")).toBe("multiembed");
  });

  test("restores previously saved provider from localStorage", () => {
    localStorage.setItem("watchlo_embed_provider", "autoembed");

    render(<Embeded id="1126166" type="movie" />);

    expect(screen.getByText(/SOURCE: AutoEmbed/i)).toBeInTheDocument();
    const iframe = screen.getByTitle("Watchlo Screening Room 1126166");
    expect(iframe).toHaveAttribute(
      "src",
      "https://player.autoembed.cc/embed/movie/1126166"
    );
  });
});
