"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Maximize,
  Minimize,
  ArrowUp,
  BookOpen,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { MangaPage, MangaChapter, MangaDetailInfo } from "@/types/manga.type";
import MangaChapterSelect from "./MangaChapterSelect";

interface MangaReaderStageProps {
  mangaId: number;
  chapterId: string;
  mangaInfo?: MangaDetailInfo | null;
  chapters: MangaChapter[];
  pages: MangaPage[];
}

type ReadingMode = "webtoon" | "paged";
type StripWidth = "reading" | "wide" | "full";

export default function MangaReaderStage({
  mangaId,
  chapterId,
  mangaInfo,
  chapters = [],
  pages = [],
}: MangaReaderStageProps) {
  const router = useRouter();

  // State
  const [readingMode, setReadingMode] = useState<ReadingMode>("webtoon");
  const [stripWidth, setStripWidth] = useState<StripWidth>("reading");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [failedPages, setFailedPages] = useState<Record<number, boolean>>({});
  const [retryKeys, setRetryKeys] = useState<Record<number, number>>({});
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  const totalPages = pages.length;
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Find current, previous, and next chapter
  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const currentChapter = currentIndex !== -1 ? chapters[currentIndex] : null;

  // Note: in typical chapter arrays, if sorted newest-first (descending),
  // "next chapter" is index - 1 (higher chapter number), and "prev chapter" is index + 1 (lower chapter number).
  // Let's check numerical order:
  let prevChapter: MangaChapter | null = null;
  let nextChapter: MangaChapter | null = null;

  if (currentChapter) {
    const currentNum = currentChapter.number;
    // Find chapter with next higher number
    const higherChapters = chapters
      .filter((c) => c.number > currentNum)
      .sort((a, b) => a.number - b.number);
    nextChapter = higherChapters[0] || null;

    // Find chapter with next lower number
    const lowerChapters = chapters
      .filter((c) => c.number < currentNum)
      .sort((a, b) => b.number - a.number);
    prevChapter = lowerChapters[0] || null;
  }

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("watchlo_manga_mode") as ReadingMode;
      if (savedMode === "webtoon" || savedMode === "paged") {
        setReadingMode(savedMode);
      }
      const savedWidth = localStorage.getItem("watchlo_manga_width") as StripWidth;
      if (savedWidth) setStripWidth(savedWidth);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const controlsVisibleRef = useRef(true);

  // Auto-hide top bar on scroll down, show on scroll up with RAF throttle
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 60) {
            if (!controlsVisibleRef.current) {
              controlsVisibleRef.current = true;
              setIsControlsVisible(true);
            }
          } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 20) {
            if (controlsVisibleRef.current) {
              controlsVisibleRef.current = false;
              setIsControlsVisible(false);
            }
          } else if (lastScrollY - currentScrollY > 20) {
            if (!controlsVisibleRef.current) {
              controlsVisibleRef.current = true;
              setIsControlsVisible(true);
            }
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save read history to localStorage
  useEffect(() => {
    if (!currentChapter) return;
    try {
      const historyKey = `watchlo_manga_history_${mangaId}`;
      const existing = localStorage.getItem(historyKey);
      interface SavedChapterHistory {
        id: string;
        chapter: string;
        number: number;
        timestamp: number;
      }
      interface SavedHistoryState {
        readChapters: string[];
        lastChapter: SavedChapterHistory | null;
      }

      let parsed: SavedHistoryState = { readChapters: [], lastChapter: null };
      if (existing) {
        parsed = JSON.parse(existing);
      }

      if (!parsed.readChapters.includes(chapterId)) {
        parsed.readChapters.push(chapterId);
      }
      parsed.lastChapter = {
        id: chapterId,
        chapter: currentChapter.chapter,
        number: currentChapter.number,
        timestamp: Date.now(),
      };

      localStorage.setItem(historyKey, JSON.stringify(parsed));
    } catch {
      // Ignore
    }
  }, [mangaId, chapterId, currentChapter]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // IntersectionObserver for Webtoon mode to update page indicator on scroll
  useEffect(() => {
    if (readingMode !== "webtoon") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute("data-page"));
            if (pageNum) setCurrentPage(pageNum);
          }
        });
      },
      { threshold: 0.25 }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [readingMode, pages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (readingMode === "paged") {
          e.preventDefault();
          if (currentPage < totalPages) {
            setCurrentPage((p) => p + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (nextChapter) {
            router.push(`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(nextChapter.id)}`);
          }
        }
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (readingMode === "paged") {
          e.preventDefault();
          if (currentPage > 1) {
            setCurrentPage((p) => p - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (prevChapter) {
            router.push(`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(prevChapter.id)}`);
          }
        }
      } else if (e.key === "]") {
        if (nextChapter) {
          router.push(`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(nextChapter.id)}`);
        }
      } else if (e.key === "[") {
        if (prevChapter) {
          router.push(`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(prevChapter.id)}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [readingMode, currentPage, totalPages, nextChapter, prevChapter, mangaId, router, toggleFullscreen]);

  // Handle retry for failed image
  const handleRetryPage = (pageNum: number) => {
    setFailedPages((prev) => ({ ...prev, [pageNum]: false }));
    setRetryKeys((prev) => ({ ...prev, [pageNum]: (prev[pageNum] || 0) + 1 }));
  };

  // Change chapter dropdown
  const handleChapterSelect = (newChapterId: string) => {
    if (!newChapterId || newChapterId === chapterId) return;
    router.push(`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(newChapterId)}`);
  };

  // Switch reading mode
  const handleModeChange = (mode: ReadingMode) => {
    setReadingMode(mode);
    try {
      localStorage.setItem("watchlo_manga_mode", mode);
    } catch {}
  };

  // Switch strip width
  const handleWidthChange = (width: StripWidth) => {
    setStripWidth(width);
    try {
      localStorage.setItem("watchlo_manga_width", width);
    } catch {}
  };

  // Title formatting
  const mangaTitle =
    mangaInfo?.title?.userPreferred ||
    mangaInfo?.title?.english ||
    mangaInfo?.title?.romaji ||
    "Manga Series";

  const stripWidthClass =
    stripWidth === "reading"
      ? "max-w-[780px]"
      : stripWidth === "wide"
      ? "max-w-[960px]"
      : "max-w-full";

  return (
    <div className="relative min-h-screen bg-[#070605] text-[#f2ece1] selection:bg-gold selection:text-black">
      {/* Top Sticky Archival Navigation Bar */}
      <header
        className={`sticky top-0 z-50 flex items-center justify-between border-b border-[#262420] bg-[#0d0c0a] px-2.5 py-2 transition-transform duration-200 sm:px-6 sm:py-2.5 ${
          isControlsVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Left: Back to Dossier & Title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href={`/manga/detail/${mangaId}`}
            className="flex items-center gap-1.5 rounded-sm border border-[#262420] bg-[#181612] px-2 py-1 font-mono text-xs text-[#a19c91] transition-colors hover:border-gold hover:text-gold sm:px-2.5"
            title="Return to Manga Dossier"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">DOSSIER</span>
          </Link>

          <div className="min-w-0">
            <Link
              href={`/manga/detail/${mangaId}`}
              className="line-clamp-1 truncate max-w-[130px] xs:max-w-[200px] sm:max-w-[360px] font-display text-xs font-bold text-[#f2ece1] hover:text-gold sm:text-sm"
            >
              {mangaTitle}
            </Link>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#a19c91]">
              <span className="text-gold font-semibold truncate max-w-[100px] sm:max-w-none">
                {currentChapter?.chapter || "Archival Chapter"}
              </span>
              {currentChapter?.language && (
                <span className="rounded-xs bg-[#221f1a] px-1 text-[9px] uppercase text-[#a19c91]">
                  {currentChapter.language}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Chapter Jump Dropdown */}
        <div className="hidden md:flex items-center gap-2">
          {prevChapter && (
            <Link
              href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                prevChapter.id
              )}`}
              className="rounded-sm border border-[#262420] bg-[#181612] p-1 text-[#a19c91] hover:border-gold hover:text-gold"
              title={`Previous: ${prevChapter.chapter}`}
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}

          <MangaChapterSelect
            chapters={chapters}
            currentChapterId={chapterId}
            onSelect={handleChapterSelect}
            variant="top"
          />

          {nextChapter && (
            <Link
              href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                nextChapter.id
              )}`}
              className="rounded-sm border border-[#262420] bg-[#181612] p-1 text-[#a19c91] hover:border-gold hover:text-gold"
              title={`Next: ${nextChapter.chapter}`}
            >
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Right: Mode & Tool Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Webtoon vs Paged Mode Toggle */}
          <div className="flex rounded-sm border border-[#262420] bg-[#181612] p-0.5">
            <button
              type="button"
              onClick={() => handleModeChange("webtoon")}
              className={`rounded-xs px-2 py-1 font-mono text-[10px] uppercase transition-colors ${
                readingMode === "webtoon"
                  ? "bg-gold font-bold text-black"
                  : "text-[#a19c91] hover:text-[#f2ece1]"
              }`}
              title="Continuous vertical scroll (Webtoon)"
            >
              STRIP
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("paged")}
              className={`rounded-xs px-2 py-1 font-mono text-[10px] uppercase transition-colors ${
                readingMode === "paged"
                  ? "bg-gold font-bold text-black"
                  : "text-[#a19c91] hover:text-[#f2ece1]"
              }`}
              title="Single page mode"
            >
              PAGED
            </button>
          </div>

          {/* Settings Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="rounded-sm border border-[#262420] bg-[#181612] p-1.5 text-[#a19c91] hover:border-gold hover:text-gold"
              title="Reader settings"
            >
              <Sliders className="size-3.5" />
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-sm border border-[#262420] bg-[#14120e] p-3 shadow-sleeve z-50">
                <div className="mb-2 border-b border-[#262420] pb-1.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                  READER PREFERENCES
                </div>

                {/* Strip Width Selector */}
                {readingMode === "webtoon" && (
                  <div className="mb-3 flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] text-[#a19c91]">
                      STAGE WIDTH
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {(["reading", "wide", "full"] as StripWidth[]).map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleWidthChange(w)}
                          className={`rounded-xs border px-1.5 py-1 font-mono text-[10px] uppercase transition-colors ${
                            stripWidth === w
                              ? "border-gold bg-gold/15 font-bold text-gold"
                              : "border-[#262420] text-[#a19c91] hover:border-gold/40"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcuts Hint */}
                <div className="border-t border-[#262420] pt-2 font-mono text-[9px] text-[#a19c91]/80">
                  <div className="flex justify-between py-0.5">
                    <span>Next Page / Ch:</span>
                    <span className="text-gold">→ or D</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>Prev Page / Ch:</span>
                    <span className="text-gold">← or A</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>Fullscreen:</span>
                    <span className="text-gold">F</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-sm border border-[#262420] bg-[#181612] p-1.5 text-[#a19c91] hover:border-gold hover:text-gold"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="size-3.5" />
            ) : (
              <Maximize className="size-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Reading Stage */}
      <main className="mx-auto flex flex-col items-center">
        {pages.length === 0 ? (
          <div className="my-24 flex flex-col items-center justify-center p-6 text-center">
            <BookOpen className="size-12 text-muted-foreground/40" />
            <h2 className="mt-4 font-display text-lg font-bold text-foreground">
              No pages returned for this chapter edition.
            </h2>
            <p className="mt-1 max-w-md font-mono text-xs text-muted-foreground">
              The scanlation provider source may temporarily be down or caching. Try selecting an alternative provider or chapter.
            </p>
            <Link
              href={`/manga/detail/${mangaId}`}
              className="mt-5 rounded-sm border border-gold bg-gold/15 px-4 py-2 font-mono text-xs font-semibold text-gold hover:bg-gold hover:text-black"
            >
              RETURN TO CHAPTER RACK
            </Link>
          </div>
        ) : readingMode === "webtoon" ? (
          /* Webtoon Continuous Strip Mode */
          <div
            className={`w-full flex flex-col items-center transition-all duration-200 ${stripWidthClass}`}
          >
            {pages.map((p, idx) => {
              const pageNum = p.page || idx + 1;
              const hasFailed = failedPages[pageNum];
              const retryKey = retryKeys[pageNum] || 0;
              const imageUrl = retryKey > 0 ? `${p.url}&_r=${retryKey}` : p.url;

              return (
                <div
                  key={pageNum}
                  ref={(el) => {
                    pageRefs.current[idx] = el;
                  }}
                  data-page={pageNum}
                  style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
                  className="relative w-full flex flex-col items-center bg-[#070605]"
                >
                  {hasFailed ? (
                    <div className="my-8 flex min-h-[400px] w-full flex-col items-center justify-center border border-dashed border-hairline bg-surface-1 p-6 text-center">
                      <p className="font-mono text-xs text-muted-foreground">
                        Failed to render page {pageNum}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRetryPage(pageNum)}
                        className="mt-3 flex items-center gap-1.5 rounded-sm border border-gold/50 bg-surface-2 px-3 py-1.5 font-mono text-xs text-gold hover:bg-gold hover:text-black"
                      >
                        <RefreshCw className="size-3" />
                        <span>RELOAD PAGE</span>
                      </button>
                    </div>
                  ) : (
                    // Standard unoptimized image for proxy rendering
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={`Page ${pageNum}`}
                      loading={idx < 3 ? "eager" : "lazy"}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedPages((prev) => ({ ...prev, [pageNum]: true }))
                      }
                      className="block w-full h-auto object-contain select-none pointer-events-auto"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Paged Mode */
          <div className="relative my-4 flex w-full max-w-4xl flex-col items-center justify-center px-2">
            {(() => {
              const currentPageObj = pages[currentPage - 1] || pages[0];
              const pageNum = currentPage;
              const hasFailed = failedPages[pageNum];
              const retryKey = retryKeys[pageNum] || 0;
              const imageUrl =
                retryKey > 0 ? `${currentPageObj.url}&_r=${retryKey}` : currentPageObj.url;

              return (
                <div className="relative flex w-full flex-col items-center">
                  {hasFailed ? (
                    <div className="my-12 flex min-h-[500px] w-full flex-col items-center justify-center border border-dashed border-hairline bg-surface-1 p-8 text-center">
                      <p className="font-mono text-sm text-muted-foreground">
                        Failed to load page {pageNum}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRetryPage(pageNum)}
                        className="mt-4 flex items-center gap-2 rounded-sm border border-gold bg-gold/15 px-4 py-2 font-mono text-xs text-gold hover:bg-gold hover:text-black"
                      >
                        <RefreshCw className="size-3.5" />
                        <span>RELOAD PAGE</span>
                      </button>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={`Page ${pageNum}`}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedPages((prev) => ({ ...prev, [pageNum]: true }))
                      }
                      className="max-h-[85vh] w-auto max-w-full rounded-sm object-contain shadow-sleeve select-none"
                    />
                  )}

                  {/* Paged Navigation Touch / Click zones */}
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      disabled={currentPage <= 1 && !prevChapter}
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage((p) => p - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else if (prevChapter) {
                          router.push(
                            `/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                              prevChapter.id
                            )}`
                          );
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-2 px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
                    >
                      <ChevronLeft className="size-4" />
                      <span>{currentPage > 1 ? "PREV PAGE" : "PREV CHAPTER"}</span>
                    </button>

                    <span className="font-mono text-xs text-gold tabular-nums font-bold">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages && !nextChapter}
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage((p) => p + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else if (nextChapter) {
                          router.push(
                            `/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                              nextChapter.id
                            )}`
                          );
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-2 px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
                    >
                      <span>{currentPage < totalPages ? "NEXT PAGE" : "NEXT CHAPTER"}</span>
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* End of Chapter Shelf */}
        {pages.length > 0 && (
          <section className="my-12 w-full max-w-2xl border-t border-hairline px-4 pt-8 text-center sm:px-6">
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                EDITION CONCLUDED
              </span>
              <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
                You reached the end of {currentChapter?.chapter || "this chapter"}.
              </h3>
              <p className="font-sans text-xs text-muted-foreground">
                Keep exploring the archive or jump to the sequential release below.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {prevChapter && (
                  <Link
                    href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                      prevChapter.id
                    )}`}
                    className="flex items-center gap-2 rounded-sm border border-hairline bg-surface-2 px-4 py-2 font-mono text-xs text-foreground hover:border-gold hover:text-gold"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>PREVIOUS ({prevChapter.chapter})</span>
                  </Link>
                )}

                {nextChapter ? (
                  <Link
                    href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                      nextChapter.id
                    )}`}
                    className="flex items-center gap-2 rounded-sm border border-gold bg-gold px-5 py-2 font-mono text-xs font-bold text-black hover:bg-gold/90"
                  >
                    <span>NEXT ({nextChapter.chapter})</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                ) : (
                  <span className="rounded-sm border border-hairline bg-surface-2 px-4 py-2 font-mono text-xs text-muted-foreground">
                    LATEST CHAPTER REACHED
                  </span>
                )}

                <Link
                  href={`/manga/detail/${mangaId}`}
                  className="rounded-sm border border-hairline bg-surface-1 px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  RETURN TO DOSSIER
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Archival Dock (Page Indicator, Chapter Jump, Prev/Next, Back to Top) */}
      <footer
        className={`fixed bottom-3 sm:bottom-4 left-1/2 z-40 -translate-x-1/2 transition-all duration-200 ${
          isControlsVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex max-w-[calc(100vw-16px)] items-center gap-1 sm:gap-2 rounded-sm border border-hairline bg-[#14120e] px-2 sm:px-3 py-1.5 shadow-sleeve text-xs">
          {/* Page Counter */}
          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] sm:text-xs font-bold text-gold tabular-nums whitespace-nowrap">
            <span>{currentPage}</span>
            <span className="text-[#a19c91]/60 font-normal">/</span>
            <span>{totalPages}</span>
          </div>

          <span className="h-3.5 w-px bg-[#262420] shrink-0" />

          {/* Quick Chapter Selector */}
          <MangaChapterSelect
            chapters={chapters}
            currentChapterId={chapterId}
            onSelect={handleChapterSelect}
            variant="dock"
          />

          {/* Previous Chapter Jump */}
          {prevChapter && (
            <>
              <span className="h-3.5 w-px bg-[#262420] shrink-0" />
              <Link
                href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                  prevChapter.id
                )}`}
                className="flex size-6 sm:size-7 items-center justify-center shrink-0 rounded-xs text-[#a19c91] transition-colors hover:bg-[#1c1915] hover:text-gold active:scale-95"
                title={`Previous: ${prevChapter.chapter}`}
                aria-label={`Previous chapter: ${prevChapter.chapter}`}
              >
                <ChevronLeft className="size-3.5 sm:size-4" />
              </Link>
            </>
          )}

          {/* Next Chapter Jump */}
          {nextChapter && (
            <>
              <span className="h-3.5 w-px bg-[#262420] shrink-0" />
              <Link
                href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                  nextChapter.id
                )}`}
                className="flex h-6 sm:h-7 items-center gap-1 shrink-0 rounded-xs bg-gold/15 px-1.5 sm:px-2 font-mono text-[10px] sm:text-xs font-bold text-gold transition-colors hover:bg-gold hover:text-black active:scale-95 whitespace-nowrap"
                title={`Next: ${nextChapter.chapter}`}
                aria-label={`Next chapter: ${nextChapter.chapter}`}
              >
                <span className="hidden xs:inline">NEXT</span>
                <ChevronRight className="size-3 sm:size-3.5" />
              </Link>
            </>
          )}

          <span className="h-3.5 w-px bg-[#262420] shrink-0" />

          {/* Scroll to Top Button */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex size-6 sm:size-7 items-center justify-center shrink-0 rounded-xs text-[#a19c91] transition-colors hover:bg-[#1c1915] hover:text-gold active:scale-95"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-3 sm:size-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
