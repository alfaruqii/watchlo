"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Spin as Hamburger } from 'hamburger-react'
import { ToggleTheme } from "./ToggleTheme";
import { useThemeStore } from "@/store/themeStore";
import ToggleSearch from "./ToggleSearch";
import Menu from "./Menu";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const { theme } = useThemeStore();

  // Add event listener for scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Menu isToggled={isOpen} />
      <div
        className={`${isScrolled ? theme === "garden" ? "bg-base-100/80 backdrop-blur-lg" : "bg-black/80 backdrop-blur-lg" : "bg-base-100"} sticky top-0 z-[90] flex items-center justify-between px-4 sm:py-2 drop-shadow-lg transition-all duration-300
          sm:px-12`}
      >
        <div className={`drop-shadow-lg ${theme === "black" ? "text-white" : "text-black"}`}>
          <Link href="/">
            <span className="sm:text-lg ">Watch</span>
            <span className="font-magnatbold sm:text-lg">milo</span>
          </Link>
        </div>
        <div className={`drop-shadow-lg hidden sm:flex gap-10 font-normal ${theme === "black" ? "text-white" : "text-black"}`}>
          <Link href="/">
            <span className="">Movies</span>
          </Link>
          <Link href="/anime">
            <span className="">Anime</span>
          </Link>
          <Link className="pointer-events-none indicator" href="/manga">
            <span className="text-gray-500 pr-5">Manga</span>
            <div className={`indicator-item font-bold px-1 w-fit badge rounded indicator-top mt-1 indicator-end text-xs ${theme === "black" ? "border-gray-400" : "border-gray-400"}`}>DEV</div>
          </Link>
          <Link href="/">
            <span className="">Docs</span>
          </Link>
          <Link href="https://github.com/alfaruqii/watchlo" target="_blank">
            <span className="">Github</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSearch />
          <ToggleTheme />
          <div className="sm:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} duration={0.6} rounded size={25} />
          </div>
        </div>
      </div>
    </>
  );
};

