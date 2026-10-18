"use client";

import parse from "html-react-parser";
import { FileText, SlidersHorizontal } from "lucide-react";
import Infos from "@/components/detail/infodetails/Infos";
import { formatDesc, formatDate } from "@/utils/formatted";
import { MangaDetailInfo } from "@/types/manga.type";
import fallbackDesc from "@/utils/fallbackDesc.json";

interface MangaInfoDetailsProps {
  item: MangaDetailInfo;
}

export default function MangaInfoDetails({ item }: MangaInfoDetailsProps) {
  const startDate = item.startIn?.year
    ? formatDate(
        new Date(
          item.startIn.year,
          (item.startIn.month ?? 1) - 1,
          item.startIn.day ?? 1
        )
      )
    : item.year
    ? String(item.year)
    : "Unknown";

  const endDate = item.endIn?.year
    ? formatDate(
        new Date(
          item.endIn.year,
          (item.endIn.month ?? 1) - 1,
          item.endIn.day ?? 1
        )
      )
    : item.status?.toUpperCase() === "FINISHED"
    ? "Completed"
    : "Ongoing";

  const description = item.description || fallbackDesc;
  const status = item.status?.replace(/_/g, " ") ?? "Unknown";
  const score = item.score?.decimalScore
    ? item.score.decimalScore.toFixed(1)
    : item.score?.averageScore
    ? (item.score.averageScore / 10).toFixed(1)
    : "NR";

  const format = (item.subtype || item.format || "MANGA").toUpperCase();
  const chapters = item.chapters ? `${item.chapters} Chapters` : "Ongoing Serial";
  const volumes = item.volumes ? `${item.volumes} Volumes` : undefined;

  const authors = item.staff
    ?.filter((s) => s.role.toLowerCase().includes("story") || s.role.toLowerCase().includes("art"))
    .map((s) => `${s.name} (${s.role})`)
    .slice(0, 3)
    .join(", ");

  const cleanSynopsis = formatDesc(description);

  return (
    <section
      aria-label="Edition technical specifications and liner notes"
      className="my-6 grid grid-cols-1 gap-6 rounded-sm border border-hairline bg-surface-1 p-5 sm:p-7 lg:grid-cols-12"
    >
      {/* Left Column: Technical Specifications (5 cols) */}
      <div className="flex flex-col lg:col-span-5 lg:border-r lg:border-hairline lg:pr-7">
        <h2 className="mb-3 flex items-center gap-2 border-b border-hairline pb-2.5 font-display text-base font-bold tracking-tight text-foreground">
          <SlidersHorizontal className="size-4 text-gold" strokeWidth={1.75} />
          <span>Archival Specifications</span>
        </h2>

        <div className="flex flex-col">
          <Infos
            topic="Archival Score"
            value={`★ ${score} / 10`}
            customTheme="text-gold font-bold"
          />
          <Infos topic="Serial Status" value={status} />
          <Infos topic="Format Medium" value={format} />
          <Infos topic="Total Chapters" value={chapters} />
          {volumes && <Infos topic="Volume Count" value={volumes} />}
          {item.countryOfOrigin && (
            <Infos
              topic="Origin"
              value={
                item.countryOfOrigin === "KR"
                  ? "South Korea (KR)"
                  : item.countryOfOrigin === "JP"
                  ? "Japan (JP)"
                  : item.countryOfOrigin === "CN"
                  ? "China (CN)"
                  : item.countryOfOrigin
              }
            />
          )}
          <Infos topic="Serialization Start" value={startDate} />
          <Infos topic="Concluded / State" value={endDate} />
          {item.title?.native && (
            <Infos topic="Native Title" value={item.title.native} />
          )}
          {item.title?.romaji && (
            <Infos topic="Romaji" value={item.title.romaji} />
          )}
          {authors && (
            <Infos
              topic="Creative Staff"
              value={authors}
              customTheme="text-gold font-semibold"
            />
          )}
        </div>
      </div>

      {/* Right Column: Liner Notes / Synopsis (7 cols) */}
      <div className="flex flex-col lg:col-span-7 lg:pl-2">
        <h2 className="mb-3 flex items-center gap-2 border-b border-hairline pb-2.5 font-display text-base font-bold tracking-tight text-foreground">
          <FileText className="size-4 text-gold" strokeWidth={1.75} />
          <span>Synopsis &amp; Archival Liner Notes</span>
        </h2>
        <div className="max-w-[68ch] text-pretty text-sm leading-relaxed text-foreground/90 sm:text-base">
          {parse(cleanSynopsis ?? "No archival liner notes indexed for this serial.")}
        </div>
      </div>
    </section>
  );
}
