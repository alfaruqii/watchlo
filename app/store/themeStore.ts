// store/themeStore.ts
import { create } from "zustand";

export interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "black",

  setTheme: (theme: string) => {
    // Persist theme in localStorage
    localStorage.setItem("theme", theme);

    // Update the theme on the document HTML element
    document.querySelector("html")?.setAttribute("data-theme", theme);

    // Update the Zustand store
    set(() => ({ theme }));
  },
}));
