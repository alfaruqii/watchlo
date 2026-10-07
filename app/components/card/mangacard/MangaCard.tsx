import React, { memo } from "react";
import Link from "next/link";
import { MangaItem } from "@/types/manga.type";
import CardImage from "../chunk/CardImage";
import CardTitle from "../chunk/CardTitle";
import SmallInfo from "@/components/detail/infodetails/SmallInfo";

interface MangaCardProps {
  manga: MangaItem;
  spineIndex?: number;
}

function MangaCardComponent({ manga, spineIndex }: MangaCardProps) {
  const mangaTitle =
    manga.title?.userPreferred ||
    manga.title?.english ||
    manga.title?.romaji ||
    manga.title?.native ||
    "Untitled Edition";

  const mangaImage =
    manga.coverImage?.large ||
    manga.coverImage?.extraLarge ||
    manga.coverImage?.medium ||
    manga.image ||
    "/fallback-card.webp";

  const spineCode =
    typeof spineIndex === "number"
      ? `FOLIO #${String(spineIndex + 1).padStart(2, "0")}`
      : "MANGA";

  const formatBadge = (
    manga.subtype ||
    manga.format ||
    "MANGA"
  ).toUpperCase();

  const numericRating = manga.score?.decimalScore
    ? manga.score.decimalScore.toFixed(1)
    : manga.score?.averageScore
      ? (manga.score.averageScore / 10).toFixed(1)
      : "NR";

  const scoreLabel = numericRating !== "NR" ? `★ ${numericRating}` : null;

  return (
    <Link
      href={`/manga/detail/${manga.id}`}
      className="block w-[164px] shrink-0 sm:w-[228px]"
    >
      <div className="group relative flex w-full flex-col rounded-sm border border-hairline bg-surface-1 p-2.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold hover:bg-surface-2 hover:z-10 hover:shadow-sleeve">
        {/* Top Collector Spine Strip */}
        <div className="mb-1.5 flex items-center justify-between gap-1 border-b border-hairline/80 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
          <span className="shrink-0 whitespace-nowrap font-semibold text-gold">
            {spineCode}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {scoreLabel && (
              <span className="text-gold font-bold">{scoreLabel}</span>
            )}
            <span className="text-[9px] rounded-xs bg-surface-3 px-1 py-0.2 border border-hairline">
              {formatBadge}
            </span>
          </div>
        </div>

        <CardImage image={mangaImage} alt={mangaTitle} />
        <CardTitle title={mangaTitle} />

        <div className="w-full">
          <SmallInfo
            year={String(manga.year || manga.chapters ? `${manga.chapters} Ch.` : formatBadge)}
            genre={manga.genres?.[0] || manga.status || "MANGA"}
            rating={numericRating}
          />
        </div>
      </div>
    </Link>
  );
}

const MangaCard = memo(MangaCardComponent);
export default MangaCard;
