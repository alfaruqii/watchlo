import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";
import { useThemeStore } from "@/store/themeStore";
import { storeResetFns } from "__mocks__/zustand";

describe("Footer component", () => {
  beforeEach(() => {
    storeResetFns.forEach((resetFn) => resetFn());

    // Set an initial state for the theme store
    useThemeStore.setState({ theme: "black", setTheme: jest.fn() });
  });

  test("renders footer with default theme styles", () => {
    // Mock the theme as "default"
    useThemeStore.setState({ theme: "black", setTheme: jest.fn() });

    render(<Footer />);
    const noticeText = screen.getByText(/ARCHIVE NOTICE:/i);

    // Check that the footer text content is rendered
    expect(noticeText).toBeInTheDocument();
    expect(
      screen.getByText(
        /Watchlo is an experimental, non-commercial catalog index/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/WATCHLO \/\/ CREATED BY/i)).toBeInTheDocument();

    // Access the parent container
    const footerDiv = screen.getByTestId(/footer-container/i);

    // Check if footerDiv exists and has hairline border
    expect(footerDiv).toBeInTheDocument();
    expect(footerDiv).toHaveClass("border-hairline");
  });

  test("renders navigation links to repertory and docs", () => {
    render(<Footer />);
    expect(screen.getByText("Cinema & TV")).toBeInTheDocument();
    expect(screen.getByText("Anime Series")).toBeInTheDocument();
    expect(screen.getByText("Manga Shelf")).toBeInTheDocument();
    expect(screen.getByText("Playback Guide & DNS")).toBeInTheDocument();
  });
});
