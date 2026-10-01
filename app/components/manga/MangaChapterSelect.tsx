"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { MangaChapter } from "@/types/manga.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MangaChapterSelectProps {
  chapters: MangaChapter[];
  currentChapterId: string;
  onSelect: (chapterId: string) => void;
  variant?: "top" | "dock";
}

export default function MangaChapterSelect({
  chapters = [],
  currentChapterId,
  onSelect,
  variant = "top",
}: MangaChapterSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Find active chapter object
  const currentChapter = useMemo(() => {
    return chapters.find((c) => c.id === currentChapterId) || null;
  }, [chapters, currentChapterId]);

  // Filter chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!query.trim()) return chapters;
    const lower = query.toLowerCase().trim();
    return chapters.filter(
      (c) =>
        c.chapter?.toLowerCase().includes(lower) ||
        c.title?.toLowerCase().includes(lower) ||
        String(c.number).includes(lower) ||
        c.language?.toLowerCase().includes(lower)
    );
  }, [chapters, query]);

  // Reset query when menu closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        {variant === "top" ? (
          <button
            type="button"
            aria-label="Jump to chapter"
            className="flex h-8 max-w-[160px] xs:max-w-[200px] sm:max-w-[280px] items-center justify-between gap-1.5 rounded-sm border border-[#262420] bg-[#181612] px-2.5 font-mono text-xs text-[#f2ece1] transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <span className="truncate">
              {currentChapter
                ? `${currentChapter.chapter}${
                    currentChapter.title ? ` — ${currentChapter.title}` : ""
                  }`
                : "Select Chapter"}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-gold/80" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Chapter selector"
            className="flex h-7 max-w-[100px] xs:max-w-[130px] sm:max-w-[180px] items-center justify-between gap-1 rounded-xs border border-[#262420] bg-[#1c1915] px-2 font-mono text-[10px] sm:text-[11px] font-semibold text-[#f2ece1] transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <span className="truncate">
              {currentChapter ? currentChapter.chapter : "Chapter"}
            </span>
            <ChevronDown className="size-2.5 sm:size-3 shrink-0 text-gold/80" />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={variant === "dock" ? "center" : "start"}
        side={variant === "dock" ? "top" : "bottom"}
        sideOffset={6}
        className="z-50 w-72 sm:w-80 rounded-sm border border-[#262420] bg-[#14120e] p-1.5 font-mono text-xs text-[#f2ece1] shadow-sleeve"
      >
        {/* Menu Header with count & search */}
        <div className="border-b border-[#262420] pb-2">
          <div className="flex items-center justify-between px-1.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a19c91]">
            <span>CHRONICLE JUMP</span>
            <span className="tabular-nums text-gold">{chapters.length} REELS</span>
          </div>

          {chapters.length > 5 && (
            <div className="relative mt-1 px-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-[#a19c91]" />
              <input
                type="text"
                placeholder="Find chapter..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full rounded-xs border border-[#262420] bg-[#1c1915] py-1 pl-7 pr-2 font-mono text-xs text-[#f2ece1] placeholder:text-[#a19c91]/60 focus:border-gold focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Scrollable Chapter List */}
        <div className="max-h-64 sm:max-h-72 overflow-y-auto py-1 scrollbar-thin">
          {filteredChapters.length === 0 ? (
            <div className="py-4 text-center font-mono text-xs text-[#a19c91]">
              No chapter found
            </div>
          ) : (
            filteredChapters.map((c) => {
              const isSelected = c.id === currentChapterId;
              return (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-2 font-mono text-xs transition-colors ${
                    isSelected
                      ? "bg-gold/15 font-bold text-gold"
                      : "text-[#f2ece1] hover:bg-[#1c1915] hover:text-gold"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="shrink-0 font-bold">{c.chapter}</span>
                    {c.title && (
                      <span className="truncate text-[11px] text-[#a19c91] font-normal">
                        — {c.title}
                      </span>
                    )}
                  </div>

                  <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    {c.language && (
                      <span className="rounded-xs border border-[#262420] bg-[#1c1915] px-1 py-0.5 text-[9px] font-bold uppercase text-[#a19c91]">
                        {c.language}
                      </span>
                    )}
                    {isSelected && <Check className="size-3 text-gold" />}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
