"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Spin as Hamburger } from "hamburger-react";
import { ToggleTheme } from "./ToggleTheme";
import { useThemeStore } from "@/store/themeStore";
import ToggleSearch from "./ToggleSearch";
import Menu from "./Menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const { theme } = useThemeStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Movies" },
    { href: "/anime", label: "Anime" },
    {
      href: "/manga",
      label: "Manga",
      disabled: true,
      badge: { text: "DEV", theme }
    },
    { href: "/", label: "Docs" },
    {
      href: "https://github.com/alfaruqii/watchlo",
      label: "Github",
      external: true
    },
  ];

  const bgClass = isScrolled
    ? `${theme === "garden" ? "bg-base-100/80" : "bg-black/80"} backdrop-blur-lg`
    : "bg-base-100";
  const textClass = theme === "black" ? "text-white" : "text-black";

  return (
    <>
      <Menu isToggled={isOpen} />
      <div className={`${bgClass} sticky top-0 z-[90] flex items-center justify-between px-4 sm:py-2 drop-shadow-lg transition-all duration-300 sm:px-12`}>
        <Link href="/" className={`drop-shadow-lg ${textClass}`}>
          <span className="sm:text-lg">Watch</span>
          <span className="font-magnatbold sm:text-lg">milo</span>
        </Link>

        <nav className={`drop-shadow-lg hidden sm:flex sm:gap-6 lg:gap-10 font-normal ${textClass}`}>
          {navLinks.map(({ href, label, disabled, badge, external }) => (
            <Link
              key={label}
              href={href}
              className={disabled ? "pointer-events-none indicator" : ""}
              {...(external ? { target: "_blank" } : {})}
            >
              <span className={disabled ? "text-gray-500 pr-5" : ""}>
                {label}
              </span>
              {badge && (
                <div className={`indicator-item font-bold px-1 w-fit badge rounded indicator-top mt-1 indicator-end text-xs ${badge.theme === "black" ? "border-gray-400" : "border-gray-400"}`}>
                  {badge.text}
                </div>
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
