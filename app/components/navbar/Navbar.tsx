"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ToggleTheme } from "./ToggleTheme";
import { useThemeStore } from "@/store/themeStore";
import ToggleSearch from "./ToggleSearch";
import Menu from "./Menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const { theme } = useThemeStore();
  const pathname = usePathname();

  // Immersive reader stage has its own dedicated top HUD and floating controls
  if (pathname.startsWith("/manga/read")) {
    return null;
  }

  const navLinks = [
    { code: "01", href: "/", label: "Movies & TV" },
    {
      code: "02",
      href: "/anime",
      label: "Anime",
      badge: { text: "NO ADS", variant: "default" as const },
    },
    {
      code: "03",
      href: "/manga",
      label: "Manga",
      disabled: false,
      badge: { text: "NEW", variant: "default" as const },
    },
    { code: "04", href: "/docs", label: "Docs" },
    {
      code: "05",
      href: "https://github.com/alfaruqii/watchlo",
      label: "GitHub",
      external: true,
    },
  ];

  const closeMenu = (): void => setOpen(false);

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return (
        pathname === "/" ||
        pathname.startsWith("/movie") ||
        pathname.startsWith("/series")
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-[90] bg-surface-1 transition-colors duration-200">
      {/* Primary Masthead Bar with Solid Stacking Context */}
      <div className="relative z-50 border-b border-hairline bg-surface-1">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-2 px-3 py-2 sm:px-6 lg:gap-3 lg:px-5 xl:gap-4 xl:px-8">
          {/* Brand & Archival Station Stamp */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="group relative flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="relative h-7 w-20 sm:h-8 sm:w-24 lg:h-8 lg:w-24 xl:h-9 xl:w-28">
                <Image
                  src={`/${theme === "garden" ? "wb" : "ww"}.webp`}
                  alt="Watchlo Archive"
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <div className="hidden items-center gap-2 border-l border-hairline pl-4 xl:flex">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground tabular-nums">
                CAT. REPERTORY // 35MM &amp; DIGITAL
              </span>
            </div>
          </div>

          {/* Editorial Navigation Rail (Desktop lg+) */}
          <nav
            aria-label="Primary catalog navigation"
            className="hidden items-center gap-0.5 lg:flex xl:gap-1.5"
          >
            {navLinks.map(({ code, href, label, disabled, badge, external }) => {
              const active = !external && !disabled && isActiveRoute(href);
              return (
                <Link
                  key={label}
                  href={href}
                  aria-disabled={disabled}
                  className={`group relative inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap xl:gap-2 xl:px-3 ${
                    disabled
                      ? "pointer-events-none opacity-40"
                      : active
                      ? "border border-hairline bg-surface-2 font-semibold text-gold"
                      : "border border-transparent text-foreground hover:border-hairline hover:bg-surface-2 hover:text-gold"
                  }`}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="hidden font-mono text-[10px] text-muted-foreground tabular-nums group-hover:text-gold xl:inline">
                    {code}
                  </span>
                  <span className="font-display tracking-tight">{label}</span>
                  {external && (
                    <ArrowUpRight
                      className="size-3 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold shrink-0"
                      strokeWidth={1.8}
                    />
                  )}
                  {badge && (
                    <Badge
                      variant={badge.variant}
                      className="ml-0.5 rounded-sm px-1 py-0 text-[8px] uppercase tracking-wider xl:px-1.5 xl:text-[9px]"
                    >
                      {badge.text}
                    </Badge>
                  )}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-[11px] h-[2px] bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Controls (lg+) */}
          <div className="hidden shrink-0 items-center gap-1.5 lg:flex xl:gap-2">
            <ToggleSearch variant="pill" />
            <ToggleTheme variant="pill" />
          </div>

          {/* Mobile & Tablet Unified Action Dock (< lg, Solid Architectural Surface) */}
          <div className="flex shrink-0 items-center lg:hidden">
            <div className="flex items-center rounded-sm border border-hairline bg-surface-2 p-0.5">
              <ToggleSearch variant="icon" />
              <span className="mx-0.5 h-3.5 w-px bg-hairline" />
              <ToggleTheme variant="icon" />
              <span className="mx-0.5 h-3.5 w-px bg-hairline" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                className={`relative size-8 rounded-sm active:scale-95 ${
                  isOpen
                    ? "bg-surface-3 text-gold"
                    : "text-foreground hover:bg-surface-3 hover:text-gold"
                }`}
              >
                <span className="sr-only">
                  {isOpen ? "Close menu" : "Open navigation menu"}
                </span>
                <div className="relative flex size-4 flex-col items-center justify-center gap-1">
                  <span
                    className={`h-[1.5px] w-3.5 rounded-none bg-current transition-all duration-200 ${
                      isOpen ? "translate-y-[2.75px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`h-[1.5px] w-3.5 rounded-none bg-current transition-all duration-200 ${
                      isOpen ? "-translate-y-[2.75px] -rotate-45" : ""
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Archival Drawer */}
      <Menu isToggled={isOpen} closeMenu={closeMenu} />
    </header>
  );
};

export default Navbar;
