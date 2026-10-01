"use client";

import { useModalStore } from "@/store/modalStore";
import { Search } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import Searched from "./Searched";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ModalSearch() {
  const { isOpen, closeModal } = useModalStore();
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 300);
  const pathname = usePathname();
  const prevPathnameRef = useRef<string>(pathname);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAnimeCatalog = pathname.split("/")[1]?.toLowerCase() === "anime";
  const isMangaCatalog = pathname.split("/")[1]?.toLowerCase() === "manga";

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      setQuery("");
      closeModal();
      prevPathnameRef.current = pathname;
    }
  }, [pathname, closeModal]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className="z-[1000] flex max-h-[28rem] flex-col gap-0 overflow-hidden rounded-sm border border-hairline bg-surface-1 px-0 py-0 text-foreground shadow-sleeve">
        <DialogTitle className="sr-only">Search media</DialogTitle>
        <DialogDescription className="sr-only">
          Search for movies, series, or anime titles.
        </DialogDescription>
        <div
          className={`w-full ${
            query.length > 0 ? "border-b border-hairline" : ""
          } bg-surface-2/60 px-4 py-3.5`}
        >
          <Label className="flex h-8 items-center gap-2.5 bg-transparent">
            <Search className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
            <Input
              ref={inputRef}
              type="text"
              placeholder={
                isMangaCatalog
                  ? "Search Manga, Manhwa & Webtoons..."
                  : isAnimeCatalog
                  ? "Search Anime Archive..."
                  : "Search Movies & TV Series..."
              }
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-full w-full border-none bg-transparent px-0 py-0 font-sans text-base text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 sm:text-sm"
            />
            <span className="hidden shrink-0 rounded-sm border border-hairline bg-surface-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold sm:inline-block">
              {isMangaCatalog
                ? "MANGA INDEX"
                : isAnimeCatalog
                ? "ANIME INDEX"
                : "CINEMA INDEX"}
            </span>
          </Label>
        </div>
        <div className="overflow-y-auto">
          <Searched searchedText={debouncedQuery} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalSearch;
