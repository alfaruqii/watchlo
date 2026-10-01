"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Sparkles,
  BookOpen,
  Github,
  ArrowUpRight,
  BookMarked,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modalStore";

interface MenuProps {
  isToggled: boolean;
  closeMenu: () => void;
}

function Menu({ isToggled = false, closeMenu }: MenuProps) {
  const pathname = usePathname();
  const { openModal } = useModalStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isToggled) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isToggled, closeMenu]);

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

  const menuItems = [
    {
      code: "01",
      href: "/",
      icon: <Film className="size-4 text-gold" strokeWidth={1.8} />,
      label: "Movies & Series",
      meta: "TMDB Repertory",
    },
    {
      code: "02",
      href: "/anime",
      icon: <Sparkles className="size-4 text-gold" strokeWidth={1.8} />,
      label: "Anime Archive",
      meta: "Simulcast & No-Ads Stream",
      badge: "NO ADS",
    },
    {
      code: "03",
      href: "/manga",
      icon: <BookMarked className="size-4 text-gold" strokeWidth={1.8} />,
      label: "Manga & Webtoon",
      meta: "Archival Comic Reader",
      disabled: false,
      badge: "NEW",
    },
    {
      code: "04",
      href: "/docs",
      icon: <BookOpen className="size-4 text-gold" strokeWidth={1.8} />,
      label: "Screening Notes",
      meta: "Playback Guide & DNS",
    },
    {
      code: "05",
      href: "https://github.com/alfaruqii/watchlo",
      icon: <Github className="size-4 text-gold" strokeWidth={1.8} />,
      label: "Source Repository",
      meta: "GitHub Project",
      external: true,
    },
  ];

  return (
    <AnimatePresence>
      {isToggled && (
        <>
          {/* Solid Backdrop Scrim (Zero Glassmorphism, behind masthead) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeMenu}
            className="fixed inset-0 z-30 bg-black/45 lg:hidden"
            aria-hidden="true"
          />

          {/* Archival Menu Drawer (Solid Matte Paper/Booth Ground, perfectly flush) */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-50 w-full overflow-hidden border-b border-hairline bg-surface-1 shadow-sleeve lg:hidden"
          >
            {/* Header Stamp */}
            <div className="flex items-center justify-between border-b border-hairline bg-surface-2 px-4 py-2.5 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gold" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground tabular-nums">
                  CATALOG DIRECTORY // REPERTORY INDEX
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums">
                REV. 2026
              </span>
            </div>

            {/* Menu Items List */}
            <ul className="divide-y divide-hairline">
              {menuItems.map((item, index) => {
                const active =
                  !item.external && !item.disabled && isActiveRoute(item.href);
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-disabled={item.disabled}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`group flex w-full items-center justify-between gap-3 px-4 py-3.5 transition-colors sm:px-6 ${
                        item.disabled
                          ? "pointer-events-none opacity-40"
                          : active
                          ? "bg-surface-2 text-gold"
                          : "text-foreground hover:bg-surface-2 hover:text-gold"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex size-7 items-center justify-center rounded-sm border font-mono text-[11px] tabular-nums transition-colors ${
                            active
                              ? "border-gold/50 bg-surface-3 text-gold"
                              : "border-hairline bg-surface-2 text-muted-foreground group-hover:border-gold/30 group-hover:text-gold"
                          }`}
                        >
                          {item.code}
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-display text-sm font-semibold tracking-tight">
                              {item.label}
                            </span>
                            {item.badge && (
                              <Badge
                                variant={item.disabled ? "outline" : "default"}
                                className="rounded-sm px-1.5 py-0 text-[9px] uppercase tracking-wider"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <span className="truncate font-mono text-[10px] text-muted-foreground">
                            {item.meta}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-gold">
                        {active ? (
                          <span className="rounded-sm border border-gold/40 bg-surface-3 px-2 py-0.5 text-[9px] font-semibold text-gold">
                            ACTIVE
                          </span>
                        ) : item.external ? (
                          <ArrowUpRight
                            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            strokeWidth={1.8}
                          />
                        ) : null}
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Quick Action Footer in Drawer */}
            <div className="flex items-center justify-between gap-3 border-t border-hairline bg-surface-2 px-4 py-3 sm:px-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  closeMenu();
                  openModal();
                }}
                className="flex items-center gap-2 rounded-sm border-hairline bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground hover:border-gold/50 hover:text-foreground active:scale-95"
              >
                <Search className="size-3.5 text-gold" strokeWidth={1.8} />
                <span className="font-display">Search catalog...</span>
                <kbd className="rounded-sm border border-hairline bg-surface-2 px-1.5 py-0.5 text-[9px] font-mono">
                  CTRL K
                </kbd>
              </Button>

              <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                WATCHLO ARCHIVE
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Menu;
