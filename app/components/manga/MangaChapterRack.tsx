"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { MangaChapter } from "@/types/manga.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MangaChapterRackProps {
  mangaId: number;
  chapters: MangaChapter[];
  availableLanguages?: string[];
  providers?: string[];
}

export default function MangaChapterRack({
  mangaId,
  chapters = [],
  availableLanguages = [],
  providers = [],
}: MangaChapterRackProps) {
  const [selectedLang, setSelectedLang] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [visibleCount, setVisibleCount] = useState<number>(60);
  const [readChapterIds, setReadChapterIds] = useState<Set<string>>(new Set());
  const [lastReadChapter, setLastReadChapter] = useState<{
    id: string;
    chapter: string;
  } | null>(null);

  // Load reading history from localStorage
  useEffect(() => {
    try {
      const historyKey = `watchlo_manga_history_${mangaId}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed.readChapters)) {
          setReadChapterIds(new Set(parsed.readChapters));
        }
        if (parsed.lastChapter) {
          setLastReadChapter(parsed.lastChapter);
        }
      }
    } catch {
      // LocalStorage unavailable or parsing error
    }
  }, [mangaId]);

  // Detected languages
  const allLanguages = useMemo(() => {
    if (availableLanguages.length > 0) return availableLanguages;
    const langs = new Set<string>();
    chapters.forEach((c) => {
      if (c.language) langs.add(c.language.toLowerCase());
    });
    return Array.from(langs);
  }, [availableLanguages, chapters]);

  // Detected providers
  const allProviders = useMemo(() => {
    if (providers.length > 0) return providers;
    const provs = new Set<string>();
    chapters.forEach((c) => {
      if (c.provider) provs.add(c.provider.toLowerCase());
    });
    return Array.from(provs);
  }, [providers, chapters]);

  // Filtered & Sorted Chapters
  const filteredChapters = useMemo(() => {
    let result = [...chapters];

    // Filter by language
    if (selectedLang !== "all") {
      result = result.filter(
        (c) => (c.language || "en").toLowerCase() === selectedLang.toLowerCase()
      );
    }

    // Filter by provider
    if (selectedProvider !== "all") {
      result = result.filter(
        (c) => (c.provider || "").toLowerCase() === selectedProvider.toLowerCase()
      );
    }

    // Search query (number or title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.chapter.toLowerCase().includes(q) ||
          (c.title && c.title.toLowerCase().includes(q)) ||
          String(c.number).includes(q)
      );
    }

    // Sort order
    result.sort((a, b) => {
      const numA = typeof a.number === "number" ? a.number : 0;
      const numB = typeof b.number === "number" ? b.number : 0;
      return sortOrder === "desc" ? numB - numA : numA - numB;
    });

    return result;
  }, [chapters, selectedLang, selectedProvider, searchQuery, sortOrder]);

  const displayedChapters = filteredChapters.slice(0, visibleCount);

  return (
    <section
      aria-label="Chapter archive rack"
      className="my-8 rounded-sm border border-hairline bg-surface-1 p-4 sm:p-6 lg:p-8"
    >
      {/* Rack Header */}
      <div className="flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <BookOpen className="size-5 text-gold" strokeWidth={1.75} />
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Archival Chapter Rack
            </h2>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {filteredChapters.length} of {chapters.length} Editions Indexed
            </p>
          </div>
        </div>

        {/* Resume reading button if exists */}
        {lastReadChapter && (
          <Link
            href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
              lastReadChapter.id
            )}`}
            className="group inline-flex w-fit self-start items-center gap-2 rounded-sm border border-gold/40 bg-surface-2 px-3 py-1.5 font-mono text-xs font-semibold text-gold transition-all duration-200 hover:border-gold hover:bg-gold hover:text-surface-1 sm:self-auto"
          >
            <Bookmark className="size-3.5 fill-gold text-gold group-hover:fill-surface-1 group-hover:text-surface-1" />
            <span>RESUME: {lastReadChapter.chapter}</span>
            <ArrowRight className="size-3 text-gold/70 transition-transform group-hover:translate-x-0.5 group-hover:text-surface-1" />
          </Link>
        )}
      </div>

      {/* Control Bar: Language, Provider, Search, Sort */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Language Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedLang("all")}
            className={`rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors ${
              selectedLang === "all"
                ? "border-gold bg-surface-2 font-bold text-gold"
                : "border-hairline bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            }`}
          >
            ALL LANG
          </button>
          {allLanguages.map((lang) => {
            const isId = lang === "id" || lang === "indonesia";
            const isEn = lang === "en" || lang === "english";
            const label = isId
              ? "🇮🇩 INDONESIA"
              : isEn
              ? "🇬🇧 ENGLISH"
              : lang.toUpperCase();

            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLang(lang)}
                className={`rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors ${
                  selectedLang === lang
                    ? "border-gold bg-surface-2 font-bold text-gold"
                    : "border-hairline bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search, Provider Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Provider Selector if > 1 */}
          {allProviders.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Filter by provider"
                  className="flex h-8 items-center gap-1.5 rounded-sm border border-hairline bg-surface-2 px-2.5 font-mono text-xs uppercase text-foreground transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                >
                  <span className="truncate max-w-[130px]">
                    {selectedProvider === "all"
                      ? "ALL PROVIDERS"
                      : selectedProvider.toUpperCase()}
                  </span>
                  <ChevronDown className="size-3 shrink-0 text-gold/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="z-50 min-w-[160px] border border-hairline bg-surface-1 p-1 shadow-sleeve"
              >
                <DropdownMenuLabel>Filter Provider</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedProvider("all")}
                  className={`flex items-center justify-between font-mono text-xs uppercase ${
                    selectedProvider === "all"
                      ? "bg-gold/15 font-bold text-gold"
                      : "text-foreground hover:bg-surface-2 hover:text-gold"
                  }`}
                >
                  <span>ALL PROVIDERS</span>
                  {selectedProvider === "all" && (
                    <Check className="size-3 text-gold" />
                  )}
                </DropdownMenuItem>
                {allProviders.map((p) => {
                  const isSelected = selectedProvider === p;
                  return (
                    <DropdownMenuItem
                      key={p}
                      onClick={() => setSelectedProvider(p)}
                      className={`flex items-center justify-between font-mono text-xs uppercase ${
                        isSelected
                          ? "bg-gold/15 font-bold text-gold"
                          : "text-foreground hover:bg-surface-2 hover:text-gold"
                      }`}
                    >
                      <span>{p.toUpperCase()}</span>
                      {isSelected && <Check className="size-3 text-gold" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Quick Chapter Search */}
          <div className="relative flex-1 sm:w-48 sm:flex-initial">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find ch. number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-hairline bg-surface-2 py-1 pl-8 pr-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* Sort Direction Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-2 px-2.5 py-1 font-mono text-xs text-foreground hover:border-gold/40 hover:text-gold"
            title={sortOrder === "desc" ? "Sort Oldest First" : "Sort Newest First"}
          >
            <ArrowUpDown className="size-3 text-gold" />
            <span>{sortOrder === "desc" ? "NEWEST" : "OLDEST"}</span>
          </button>
        </div>
      </div>

      {/* Chapters Grid Shelf */}
      {displayedChapters.length === 0 ? (
        <div className="my-8 flex flex-col items-center justify-center rounded-sm border border-dashed border-hairline py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground/40" />
          <p className="mt-2 font-display text-sm font-semibold text-muted-foreground">
            No matching chapters found in this archival query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedLang("all");
              setSelectedProvider("all");
              setSearchQuery("");
            }}
            className="mt-3 font-mono text-xs text-gold underline hover:text-gold/80"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {displayedChapters.map((chapter) => {
            const isRead = readChapterIds.has(chapter.id);
            const isIndo = chapter.language?.toLowerCase() === "id";

            return (
              <Link
                key={chapter.id}
                href={`/manga/read?id=${mangaId}&chapter=${encodeURIComponent(
                  chapter.id
                )}`}
                className={`group relative flex flex-col justify-between rounded-sm border p-2.5 transition-all duration-200 ${
                  isRead
                    ? "border-hairline/80 bg-surface-1/50 opacity-70 hover:opacity-100 hover:border-gold"
                    : "border-hairline bg-surface-2/60 hover:-translate-y-0.5 hover:border-gold hover:bg-surface-2"
                }`}
              >
                {/* Top strip: Language & Provider chip */}
                <div className="mb-1 flex items-center justify-between gap-1 font-mono text-[10px] tabular-nums">
                  <span
                    className={`rounded-xs px-1 py-0.5 font-bold uppercase ${
                      isIndo
                        ? "bg-vermilion/15 text-vermilion"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    {chapter.language?.toUpperCase() || "EN"}
                  </span>
                  <span className="truncate text-[9px] uppercase text-muted-foreground">
                    {chapter.provider}
                  </span>
                </div>

                {/* Chapter Number & Title */}
                <div className="my-1">
                  <p className="font-display text-xs font-bold text-foreground group-hover:text-gold">
                    {chapter.chapter}
                  </p>
                  {chapter.title && chapter.title !== chapter.chapter && (
                    <p className="mt-0.5 line-clamp-1 font-sans text-[11px] text-muted-foreground">
                      {chapter.title}
                    </p>
                  )}
                </div>

                {/* Bottom meta / read status */}
                <div className="mt-1 flex items-center justify-between border-t border-hairline/50 pt-1 font-mono text-[9px] text-muted-foreground">
                  <span>
                    {chapter.scanlationGroup ||
                      (chapter.publishedAt
                        ? chapter.publishedAt.split("T")[0]
                        : "SERIAL")}
                  </span>
                  {isRead && (
                    <span className="flex items-center gap-0.5 text-gold">
                      <CheckCircle2 className="size-2.5" />
                      <span>READ</span>
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Show more button if list is long */}
      {filteredChapters.length > visibleCount && (
        <div className="mt-6 flex justify-center border-t border-hairline pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 60)}
            className="rounded-sm border border-hairline bg-surface-2 px-5 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            LOAD MORE CHAPTERS ({filteredChapters.length - visibleCount} REMAINING)
          </button>
        </div>
      )}
    </section>
  );
}
