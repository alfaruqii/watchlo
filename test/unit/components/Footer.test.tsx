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
    const disclaimerText = screen.getByText(/disclaimer/i);

    // Check that the footer text content is rendered
    expect(disclaimerText).toBeInTheDocument();
    expect(
      screen.getByText(
        /please use this site wisely, dont use it to search some inappropriate film/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/copyright © 2024 watchlo/i)).toBeInTheDocument();

    // // Access the parent div
    const footerDiv = screen.getByTestId(/footer-container/i);

    // Check if footerDiv exists and verify the theme-specific class
    expect(footerDiv).toBeInTheDocument();
    expect(footerDiv).toHaveClass("border-gray-300/20");
  });

  test("applies 'garden' theme styles correctly", () => {
    // Mock the theme as "garden"
    useThemeStore.setState({ theme: "garden", setTheme: jest.fn() });

    render(<Footer />);
    const footerDiv = screen.getByTestId(/footer-container/i);

    // Check if footerDiv exists and verify the theme-specific class
    expect(footerDiv).toBeInTheDocument();
    // Check that the "garden" theme border class is applied
    expect(footerDiv).toHaveClass("border-gray-700/20");
  });
});
