"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Mic,
  User,
  Sparkles,
  Building2,
  UserSquare2,
  ChevronDown,
  Check,
  Globe,
  Languages,
} from "lucide-react";
import {
  MediaCharacterItem,
  MediaStaffItem,
  MediaStudioItem,
} from "@/types/anime.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselFadeMask,
} from "@/components/ui/carousel";

interface AnimeVoiceActorsRackProps {
  characters?: MediaCharacterItem[];
  staff?: MediaStaffItem[];
  studios?: MediaStudioItem[];
  title?: string;
  isManga?: boolean;
}

export default function AnimeVoiceActorsRack({
  characters = [],
  staff = [],
  studios = [],
  title = "Characters & Voice Cast",
  isManga = false,
}: AnimeVoiceActorsRackProps) {
  const [activeTab, setActiveTab] = useState<"characters" | "staff">("characters");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Japanese");

  // Determine available languages across all voice actors
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    characters.forEach((char) => {
      char.voiceActors?.forEach((va) => {
        if (va.language) langs.add(va.language);
      });
    });
    const arr = Array.from(langs);
    // Prioritize Japanese first, English second
    return arr.sort((a, b) => {
      if (a === "Japanese") return -1;
      if (b === "Japanese") return 1;
      if (a === "English") return -1;
      if (b === "English") return 1;
      return a.localeCompare(b);
    });
  }, [characters]);

  // Filter main/animation studios vs production partners to keep UI clean and compact
  const { mainStudios, partnerCount } = useMemo(() => {
    const main = studios.filter((s) => s.isMain || s.isAnimationStudio);
    const selected = main.length > 0 ? main.slice(0, 3) : studios.slice(0, 2);
    const remaining = studios.length - selected.length;
    return { mainStudios: selected, partnerCount: Math.max(0, remaining) };
  }, [studios]);

  if (!characters.length && !staff.length && !studios.length) {
    return null;
  }

  const displayCharacters = characters.slice(0, 30);
  const displayStaff = staff.slice(0, 24);

  return (
    <section
      aria-label="Anime characters, voice cast, and production personnel"
      className="scroll-mt-24 my-6 rounded-sm border border-hairline bg-surface-1 p-3.5 sm:p-6"
    >
      {/* 1. Header Bar: Title, Icon & Archival Badge */}
      <div className="flex items-start justify-between gap-2.5 border-b border-hairline pb-3 sm:items-center">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-hairline bg-surface-2 text-gold">
            {isManga ? (
              <UserSquare2 className="size-4" strokeWidth={1.75} />
            ) : (
              <Mic className="size-4" strokeWidth={1.75} />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg">
              {isManga ? "Characters & Creative Personnel" : title}
            </h2>
            <span className="font-mono text-[9px] tracking-wider uppercase text-gold sm:text-[10px]">
              {isManga ? "Original Mangaka & Character Dossier" : "Voice Actor (Seiyuu) & Staff Ledger"}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="shrink-0 border-gold/30 font-mono text-[9px] uppercase tracking-wider text-gold sm:text-[10px]"
        >
          {isManga ? "MANGA ARCHIVE" : "SEIYUU INDEX"}
        </Badge>
      </div>

      {/* 2. Control Toolbar: Mode Switcher Tabs + Custom Radix DropdownMenu */}
      <div className="my-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-sm border border-hairline bg-surface-2 p-1 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("characters")}
            className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xs px-2.5 py-1.5 h-auto font-mono text-xs transition-colors sm:px-3 ${
              activeTab === "characters"
                ? "bg-surface-1 text-gold font-semibold shadow-xs hover:bg-surface-1 hover:text-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-3.5 shrink-0" />
            <span>Characters</span>
            <span className="text-[10px] text-muted-foreground">({displayCharacters.length})</span>
          </Button>
          {displayStaff.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("staff")}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xs px-2.5 py-1.5 h-auto font-mono text-xs transition-colors sm:px-3 ${
                activeTab === "staff"
                  ? "bg-surface-1 text-gold font-semibold shadow-xs hover:bg-surface-1 hover:text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="size-3.5 shrink-0" />
              <span>Staff</span>
              <span className="hidden sm:inline">&amp; Creators</span>
              <span className="text-[10px] text-muted-foreground">({displayStaff.length})</span>
            </Button>
          )}
        </div>

        {/* Custom Audio Language DropdownMenu (NO NATIVE SELECT) */}
        {!isManga && availableLanguages.length > 1 && activeTab === "characters" && (
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:hidden">
              Audio Track:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center justify-between gap-2 rounded-sm border-hairline bg-surface-2 px-3 py-1.5 h-auto font-mono text-xs text-foreground hover:border-gold/50 hover:bg-surface-1 hover:text-gold"
                >
                  <Globe className="size-3.5 text-gold shrink-0" strokeWidth={1.75} />
                  <span className="hidden text-[10px] uppercase text-muted-foreground sm:inline">Audio:</span>
                  <span className="font-semibold text-gold">
                    {selectedLanguage}
                  </span>
                  <ChevronDown className="size-3 text-muted-foreground shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                collisionPadding={16}
                className="w-48 max-h-60 overflow-y-auto rounded-sm border border-hairline bg-surface-1 p-1 text-foreground shadow-sleeve z-50"
              >
                <DropdownMenuLabel className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Languages className="size-3 text-gold" />
                  <span>Select Voice Language</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-hairline" />
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase();
                  return (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`flex items-center justify-between rounded-xs px-2.5 py-1.5 font-mono text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-surface-2 text-gold font-bold"
                          : "text-foreground hover:bg-surface-2 hover:text-gold"
                      }`}
                    >
                      <span>{lang}</span>
                      {isSelected && <Check className="size-3.5 text-gold" strokeWidth={2.5} />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* 3. Studios Highlight Ledger Strip */}
      {mainStudios.length > 0 && !isManga && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xs border border-hairline/70 bg-surface-2/40 px-3 py-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Building2 className="size-3 text-gold" />
            <span>Studio:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {mainStudios.map((studio) => (
              <Badge
                key={studio.id}
                variant={studio.isMain ? "default" : "secondary"}
                className={`font-mono text-[10px] ${
                  studio.isMain
                    ? "bg-gold text-surface-0 font-bold"
                    : "border-hairline text-foreground"
                }`}
              >
                {studio.name}
                {studio.isMain && " ★ Main"}
              </Badge>
            ))}
            {partnerCount > 0 && (
              <span className="font-mono text-[10px] text-muted-foreground">
                +{partnerCount} partners
              </span>
            )}
          </div>
        </div>
      )}

      {/* 4. Characters Tab Content */}
      {activeTab === "characters" && (
        <Carousel className="w-full">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {displayCharacters.length} Personnel Cataloged // Drag or navigate
            </span>
            <CarouselNavigation />
          </div>
          <div className="relative">
            <CarouselFadeMask fromColor="from-surface-1" />
            <CarouselContent className="-ml-3 py-1">
              {displayCharacters.map((char) => {
                const charImg = char.image?.large || char.image?.medium;
                const primaryVa =
                  char.voiceActors?.find(
                    (va) => va.language?.toLowerCase() === selectedLanguage.toLowerCase()
                  ) || char.voiceActors?.[0];
                const vaImg = primaryVa?.image?.large || primaryVa?.image?.medium;

                const isMain = char.role === "MAIN";

                return (
                  <CarouselItem key={char.id} className="pl-3 basis-auto">
                    <div className="group flex w-[170px] shrink-0 flex-col rounded-sm border border-hairline bg-surface-2 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 sm:w-[196px]">
                {/* Role and Spine Tag */}
                <div className="mb-2 flex items-center justify-between font-mono text-[9px]">
                  <Badge
                    variant="outline"
                    className={`px-1.5 py-0 text-[9px] uppercase tracking-wider ${
                      isMain
                        ? "border-gold/40 bg-gold/10 text-gold font-semibold"
                        : "border-hairline text-muted-foreground"
                    }`}
                  >
                    {char.role || "CHARACTER"}
                  </Badge>
                  {primaryVa?.language && !isManga && (
                    <span className="text-[10px] text-muted-foreground">
                      {primaryVa.language.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Character & Voice Actor Visual Pair */}
                <div className="relative mb-2 grid grid-cols-2 gap-1.5 overflow-hidden rounded-xs border border-hairline/60 bg-surface-1 p-1">
                  {/* Character Half */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xs bg-surface-0">
                    {charImg ? (
                      <Image
                        unoptimized
                        src={charImg}
                        alt={char.name.userPreferred || char.name.full}
                        fill
                        sizes="90px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="size-6 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-surface-0/85 px-1 py-0.5 text-center font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                      Char
                    </span>
                  </div>

                  {/* Voice Actor Half (or Manga Art details) */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xs bg-surface-0">
                    {vaImg && !isManga ? (
                      <Image
                        unoptimized
                        src={vaImg}
                        alt={primaryVa?.name?.userPreferred || primaryVa?.name?.full || "Voice Actor"}
                        fill
                        sizes="90px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-1 text-center font-mono text-[8px] text-muted-foreground">
                        <Mic className="mb-0.5 size-4 text-hairline" />
                        <span>{isManga ? "Original" : "No VA"}</span>
                      </div>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-surface-0/85 px-1 py-0.5 text-center font-mono text-[8px] uppercase tracking-wider text-gold">
                      {isManga ? "Design" : "Seiyuu"}
                    </span>
                  </div>
                </div>

                {/* Metadata & Names */}
                <div className="flex flex-col gap-1 border-t border-hairline/60 pt-1.5">
                  <div className="flex flex-col">
                    <span
                      className="line-clamp-1 text-xs font-semibold text-foreground group-hover:text-gold"
                      title={char.name.userPreferred || char.name.full}
                    >
                      {char.name.userPreferred || char.name.full}
                    </span>
                    {char.name.native && (
                      <span className="line-clamp-1 font-sans text-[10px] text-muted-foreground/80">
                        {char.name.native}
                      </span>
                    )}
                  </div>

                  {!isManga && primaryVa && (
                    <div className="flex flex-col pt-0.5">
                      <span
                        className="line-clamp-1 text-[11px] text-gold/90"
                        title={primaryVa.name.userPreferred || primaryVa.name.full}
                      >
                        VA: {primaryVa.name.userPreferred || primaryVa.name.full}
                      </span>
                      {primaryVa.name.native && (
                        <span className="line-clamp-1 font-sans text-[9px] text-muted-foreground">
                          {primaryVa.name.native}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
          </div>
        </Carousel>
      )}

      {/* 5. Staff Tab Content */}
      {activeTab === "staff" && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayStaff.map((person) => {
            const personImg = person.image?.large || person.image?.medium;
            return (
              <div
                key={person.id}
                className="flex items-center gap-2.5 rounded-sm border border-hairline bg-surface-2 p-2.5 transition-colors hover:border-gold/30"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xs border border-hairline bg-surface-1">
                  {personImg ? (
                    <Image
                      unoptimized
                      src={personImg}
                      alt={person.name.userPreferred || person.name.full}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {person.name.userPreferred || person.name.full}
                  </span>
                  <span className="truncate font-mono text-[10px] font-medium text-gold">
                    {person.role || person.primaryOccupations?.join(", ") || "Production"}
                  </span>
                  {person.name.native && (
                    <span className="truncate font-sans text-[10px] text-muted-foreground">
                      {person.name.native}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
