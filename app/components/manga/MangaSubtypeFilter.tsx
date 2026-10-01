"use client";

import { useTransition, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Sparkles, BookMarked, Layers, Loader2 } from "lucide-react";
import { MangaSubtype } from "@/types/manga.type";
import { Button } from "@/components/ui/button";

interface FilterOption {
  key: MangaSubtype;
  label: string;
  countLabel: string;
  icon: React.ReactNode;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    key: "all",
    label: "All Editions",
    countLabel: "FULL REPERTORY",
    icon: <Layers className="size-3.5" strokeWidth={1.75} />,
  },
  {
    key: "manhwa",
    label: "Korean Manhwa",
    countLabel: "WEBTOON STRIPS",
    icon: <Sparkles className="size-3.5" strokeWidth={1.75} />,
  },
  {
    key: "manga",
    label: "Japanese Manga",
    countLabel: "CLASSIC SERIALS",
    icon: <BookOpen className="size-3.5" strokeWidth={1.75} />,
  },
  {
    key: "manhua",
    label: "Chinese Manhua",
    countLabel: "COLOR VOLUMES",
    icon: <BookMarked className="size-3.5" strokeWidth={1.75} />,
  },
];

export default function MangaSubtypeFilter({
  activeSubtype = "all",
}: {
  activeSubtype?: MangaSubtype;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingSubtype, setPendingSubtype] = useState<MangaSubtype | null>(null);

  const handleSelect = (subtype: MangaSubtype) => {
    setPendingSubtype(subtype);
    const params = new URLSearchParams(searchParams.toString());
    if (subtype === "all") {
      params.delete("subtype");
    } else {
      params.set("subtype", subtype);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  };

  return (
    <div className="w-full border-b border-hairline bg-surface-1 px-4 py-3 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Left: Section Label */}
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="text-gold">ARCHIVE FILTER</span>
          <span>{"//"}</span>
          <span>SELECT MEDIUM</span>
        </div>

        {/* Right: Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {FILTER_OPTIONS.map((opt) => {
            const isSelected = activeSubtype === opt.key;
            const isOptionPending = isPending && pendingSubtype === opt.key;
            return (
              <Button
                key={opt.key}
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => handleSelect(opt.key)}
                className={`group flex h-auto items-center gap-2 rounded-sm border px-3 py-1.5 font-display text-xs transition-all duration-200 ${
                  isSelected
                    ? "border-gold bg-surface-2 font-bold text-gold shadow-sm hover:bg-surface-2 hover:text-gold"
                    : "border-hairline bg-surface-1 text-muted-foreground hover:border-gold/40 hover:bg-surface-2 hover:text-foreground"
                } ${isOptionPending ? "opacity-75" : ""}`}
              >
                <span
                  className={
                    isSelected
                      ? "text-gold"
                      : "text-muted-foreground group-hover:text-gold"
                  }
                >
                  {isOptionPending ? (
                    <Loader2 className="size-3.5 animate-spin text-gold" />
                  ) : (
                    opt.icon
                  )}
                </span>
                <span>{opt.label}</span>
                <span
                  className={`hidden font-mono text-[9px] uppercase tracking-wider tabular-nums sm:inline ${
                    isSelected ? "text-gold/80" : "text-muted-foreground/70"
                  }`}
                >
                  [{opt.countLabel}]
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
