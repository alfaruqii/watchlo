"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface AnimeCardDetailProps {
  animeImage?: string;
  episodeId: string;
  id: string;
  episodeNumber: number;
}

export const AnimeCardDetail = ({
  animeImage,
  episodeId,
  id,
  episodeNumber,
}: AnimeCardDetailProps) => {
  const [isImageLoading, setImageLoading] = useState(true);
  const safeImage =
    animeImage && animeImage.trim() !== "" ? animeImage : "/fallback-card.webp";
  const [imgSrc, setImgSrc] = useState<string>(safeImage);

  useEffect(() => {
    setImgSrc(
      animeImage && animeImage.trim() !== "" ? animeImage : "/fallback-card.webp"
    );
  }, [animeImage]);

  const isDub = episodeId.includes("-dub");
  const route = {
    pathname: `/anime/watch`,
    query: {
      id: id,
      ep: episodeNumber,
      ...(isDub && { isDub: true }),
    },
  };

  return (
    <Link href={route} className="block w-36 shrink-0 sm:w-52">
      <div className="group relative flex w-full flex-col rounded-sm border border-hairline bg-surface-2 p-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold hover:z-10 hover:shadow-sleeve">
        <div className="mb-1.5 flex items-center justify-between border-b border-hairline pb-1 font-mono text-[10px] uppercase tracking-wider text-gold tabular-nums">
          <span>REEL #{String(episodeNumber).padStart(2, "0")}</span>
          <span className="text-muted-foreground">{isDub ? "DUB" : "SUB"}</span>
        </div>
        <div className="relative mb-1.5 w-full aspect-[2/3] overflow-hidden rounded-sm border border-hairline/80 bg-surface-3">
          <figure className="relative h-full w-full overflow-hidden">
            {isImageLoading && (
              <div className="absolute inset-0 z-10 animate-pulse bg-surface-3" />
            )}
            <Image
              unoptimized
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                if (imgSrc !== "/fallback-card.webp") {
                  setImgSrc("/fallback-card.webp");
                }
              }}
              className={`object-cover transition-custom-blur ${
                isImageLoading
                  ? "scale-110 blur-2xl"
                  : "scale-100 blur-0 group-hover:scale-105"
              }`}
              src={imgSrc}
              alt={`Reel ${episodeNumber}`}
              fill
              sizes="(max-width: 768px) 128px, 192px"
            />
          </figure>
        </div>
        <p className="w-full truncate font-display text-sm font-bold text-foreground group-hover:text-gold">
          Episode {episodeNumber}
        </p>
      </div>
    </Link>
  );
};
