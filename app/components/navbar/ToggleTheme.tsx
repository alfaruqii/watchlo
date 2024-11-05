"use client";

import React, { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { IoPartlySunny } from "react-icons/io5";
import { FaCloudMoon } from "react-icons/fa";

export const ToggleTheme = (): JSX.Element => {
  const { theme, setTheme } = useThemeStore();

  // Toggle the theme and update the Zustand store
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('black');
    } else {
      setTheme('garden');
    }
  };

  // Sync the theme with localStorage and document on mount
  useEffect(() => {
    const localTheme = localStorage.getItem('theme') ?? 'black';
    setTheme(localTheme); // Sync Zustand state with localStorage on mount
  }, [setTheme]);

  return (
    <>
      <label className={`swap swap-rotate btn px-1.5 btn-sm rounded drop-shadow border-2 ${theme === "garden" ? "border-gray-800" : "border-gray-300"}`}>
        {/* this hidden checkbox controls the state */}
        <input
          onChange={handleToggle}
          checked={theme === 'black'}
          type="checkbox"
          className="theme-controller"
        />

        {/* sun icon */}
        <IoPartlySunny className="swap-off" size={24} />
        {/* moon icon */}
        <FaCloudMoon className="swap-on" size={24} />
      </label>
    </>
  );
};

