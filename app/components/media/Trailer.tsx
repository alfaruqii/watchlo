"use client";
import { AnimeInfo } from '@/types/anime.type'
import { useState } from 'react'
import Image from 'next/image'
import PlayButton from "./PlayButton";
import { Video } from '@/types/movies.type';
import { usePathname } from 'next/navigation';

function Trailer({ trailer }: { trailer: AnimeInfo["trailer"] | Video }) {
  const [isImageLoading, setImageLoading] = useState(true);
  const pathName = usePathname();
  const pathType = pathName.split('/')[1]; // This gives you either 'movie' or 'tv'
  const isMoviePath = pathType.toLowerCase() === "movie" || pathType.toLowerCase() === "series";
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!trailer || !trailer.id) {
    return null; // Don't render anything if there's no trailer
  }

  let videoUrl = '';
  switch (trailer.site?.toLowerCase()) {
    case 'youtube':
      videoUrl = `https://www.youtube.com/embed/${"key" in trailer ? trailer.key : trailer.id ?? "xvFZjo5PgG0"}?autoplay=1`;
      break;
    case 'dailymotion':
      videoUrl = `https://www.dailymotion.com/embed/video/${trailer.id}?autoplay=1`;
      break;
    default:
      return null; // Don't render if the platform is not supported
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="mt-4 flex flex-col items-center overflow-hidden">
      <p className="text-center w-full text-xl mb-2 font-bold">Trailer 💡</p>
      <div className={`relative aspect-video w-full overflow-hidden rounded drop-shadow-lg ${isMoviePath ? "" : "sm:w-2/5"}`}>
        {!isPlaying ? (
          <div className="relative h-full w-full cursor-pointer" onClick={handlePlay}>
            <Image
              unoptimized
              src={trailer.thumbnail}
              alt="Video Thumbnail"
              layout="fill"
              objectFit="cover"
              onLoad={() => setImageLoading(false)}
              className={`transition-custom-blur object-cover rounded ${isImageLoading ? "blur-3xl" : "blur-0"}`}
            />
            <PlayButton />
          </div>
        ) : (
          <iframe
            src={videoUrl}
            title={trailer.id}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full rounded"
          ></iframe>
        )}
      </div>
    </div>
  )
}

export default Trailer;
