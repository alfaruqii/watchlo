"use client";
import { AnimeInfo } from '@/types/anime.type'
import { useState } from 'react'
import Image from 'next/image'
import PlayButton from "./PlayButton";

function Trailer({ trailer }: { trailer: AnimeInfo["trailer"] }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!trailer || !trailer.id) {
    return null; // Don't render anything if there's no trailer
  }

  let videoUrl = '';
  switch (trailer.site.toLowerCase()) {
    case 'youtube':
      videoUrl = `https://www.youtube.com/embed/${trailer.id}?autoplay=1`;
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
    <div className="mt-4 flex items-center flex-col">
      <div className="w-full sm:w-2/5 relative aspect-video drop-shadow-lg rounded overflow-hidden">
        {!isPlaying ? (
          <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
            <Image
              src={trailer.thumbnail}
              alt="Video Thumbnail"
              layout="fill"
              objectFit="cover"
            />
            <PlayButton />
          </div>
        ) : (
          <iframe
            src={videoUrl}
            title="Anime Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        )}
      </div>
    </div>
  )
}

export default Trailer;
