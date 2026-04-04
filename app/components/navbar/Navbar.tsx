"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Spin as Hamburger } from "hamburger-react";
import { ToggleTheme } from "./ToggleTheme";
import { useThemeStore } from "@/store/themeStore";
import ToggleSearch from "./ToggleSearch";
import Menu from "./Menu";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const { theme } = useThemeStore();

  const navLinks = [
    { href: "/", label: "Movies" },
    {
      href: "/anime",
      label: "Anime",
      badge: { text: "No ads", theme },
    },
    {
      href: "/manga",
      label: "Manga",
      disabled: true,
      badge: { text: "DEV", theme },
    },
    { href: "/docs", label: "Docs" },
    {
      href: "https://github.com/alfaruqii/watchlo",
      label: "Github",
      external: true,
    },
  ];

  const textClass = theme === "black" ? "text-white" : "text-black";
  const closeMenu = (): void => setOpen(false);

  return (
    <>
      <Menu isToggled={isOpen} closeMenu={closeMenu} />
      <div
        className={`${
          theme === "garden"
            ? "bg-white border-gray-700/20"
            : "bg-black border-gray-300/20"
        } sticky top-0 z-[90] flex items-center justify-between border-b px-4 transition-all  duration-300 lg:px-12 sm:py-2`}
      >
        <button type="button" onClick={closeMenu}>
        <Link href="/" className={`${textClass} relative flex items-center`}>
          <div className="w-24 sm:w-32 h-12 relative">
            <Image
              src={`/${theme === "garden" ? "wb" : "ww"}.webp`}
              alt="logo"
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-contain text-red-400"
              priority
            />
          </div>
        </Link>
        </button>

        <nav
          className={`${textClass} hidden font-normal drop-shadow-lg sm:flex sm:gap-8 lg:gap-12`}
        >
          {navLinks.map(({ href, label, disabled, badge, external }) => (
            <Link
              key={label}
              href={href}
              className={`relative inline-flex ${
                badge
                  ? disabled
                    ? "pointer-events-none"
                    : ""
                  : ""
              }`}
              {...(external ? { target: "_blank" } : {})}
            >
              <span
                className={
                  badge ? (disabled ? "text-gray-500 pr-5" : "pr-7") : ""
                }
              >
                {label}
              </span>
              {badge && (
                <span
                  className={`${
                    badge.theme === "black"
                      ? "border-gray-400 bg-black text-white"
                      : "border-gray-400 bg-white text-black"
                  } absolute -right-3 -top-2 w-fit rounded border px-1 text-xs font-bold`}
                >
                  {badge.text}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ToggleSearch />
          <ToggleTheme />
          <div className="sm:hidden">
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              duration={0.6}
              rounded
              size={25}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
