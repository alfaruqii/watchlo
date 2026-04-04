"use client";

import React, { useEffect, type JSX } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { IoPartlySunny } from "react-icons/io5";
import { FaCloudMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const ToggleTheme = (): JSX.Element => {
  const { theme, setTheme } = useThemeStore();

  // Toggle the theme and update the Zustand store
  const handleToggle = () => {
    setTheme(theme === 'black' ? 'garden' : 'black');
  };

  // Sync the theme with localStorage and document on mount
  useEffect(() => {
    const localTheme = localStorage.getItem('theme') ?? 'black';
    setTheme(localTheme); // Sync Zustand state with localStorage on mount
  }, [setTheme]);

  return (
    <>
      <Button
        type="button"
        onClick={handleToggle}
        variant="outline"
        size="sm"
        className={`px-1.5 rounded drop-shadow border-2 ${theme === "garden" ? "border-gray-800" : "border-gray-300"}`}
        aria-label="Toggle theme"
      >
        {theme === 'black' ? <IoPartlySunny size={24} /> : <FaCloudMoon size={24} />}
      </Button>
    </>
  );
};

