"use client";
import { AnimeInfo } from "@/types/anime.type";
import { useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import PlayButton from "./PlayButton";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/movies.type";
import { usePathname } from "next/navigation";

function Trailer({ trailer }: { trailer: AnimeInfo["trailer"] | Video }) {
  const [isImageLoading, setImageLoading] = useState(true);
  const pathName = usePathname();
  const pathType = pathName.split("/")[1];
  const isMoviePath =
    pathType.toLowerCase() === "movie" || pathType.toLowerCase() === "series";
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!trailer || !trailer.id) {
    return null;
  }

  let videoUrl = "";
  switch (trailer.site?.toLowerCase()) {
    case "youtube":
      videoUrl = `https://www.youtube.com/embed/${
        "key" in trailer ? trailer.key : trailer.id ?? "xvFZjo5PgG0"
      }?autoplay=0`;
      break;
    case "dailymotion":
      videoUrl = `https://www.dailymotion.com/embed/video/${trailer.id}?autoplay=1`;
      break;
    default:
      return null;
  }

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const thumbnailSrc =
    (trailer.thumbnail && trailer.thumbnail.trim()) ||
    (trailer.site?.toLowerCase() === "youtube"
      ? `https://i.ytimg.com/vi/${"key" in trailer ? trailer.key : trailer.id}/hqdefault.jpg`
      : "/fallback-banner.webp");

  return (
    <section className="flex flex-col overflow-hidden rounded-sm border border-hairline bg-surface-1 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-hairline pb-2.5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
          <Film className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
          <span>Theatrical Preview</span>
        </h2>
        <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums sm:text-[11px]">
          35MM TEASER
        </span>
      </div>

      <div
        className={`obi-frame-corners relative aspect-video w-full overflow-hidden rounded-sm border border-hairline bg-[#0d0c0a] ${
          isMoviePath ? "" : "mx-auto sm:max-w-2xl"
        }`}
      >
        {!isPlaying ? (
          <Button
            type="button"
            variant="ghost"
            aria-label="Play theatrical trailer"
            className="group relative h-full w-full cursor-pointer text-left p-0 rounded-none hover:bg-transparent"
            onClick={handlePlay}
          >
            <Image
              unoptimized
              src={thumbnailSrc}
              alt="Video Thumbnail"
              fill
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              className={`object-cover transition-custom-blur ${
                isImageLoading
                  ? "blur-2xl"
                  : "blur-0 group-hover:scale-105 group-hover:duration-500"
              }`}
            />
            <div className="absolute inset-0 bg-[#0d0c0a]/35 transition-colors group-hover:bg-[#0d0c0a]/20" />
            <PlayButton />
          </Button>
        ) : (
          <iframe
            src={videoUrl}
            title={trailer.id}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>
    </section>
  );
}

export default Trailer;
