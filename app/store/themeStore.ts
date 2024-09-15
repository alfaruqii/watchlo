// store/themeStore.ts
import { create } from 'zustand';

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: typeof window !== 'undefined' && localStorage.getItem('theme')
    ? localStorage.getItem('theme') || 'garden'
    : 'garden', // Default to 'garden'

  setTheme: (theme: string) => {
    // Persist theme in localStorage
    localStorage.setItem('theme', theme);

    // Update the theme on the document HTML element
    document.querySelector('html')?.setAttribute('data-theme', theme);

    // Update the Zustand store
    set(() => ({ theme }));
  },
}));

