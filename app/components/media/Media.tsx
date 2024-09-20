"use client";
import { StreamInfo } from '@/types/anime.type';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { useRef, useState, useEffect } from 'react';
import Quality from '../quality/Quality';

interface MediaProps extends StreamInfo {
  poster: string;
  title: string;
}

export const Media = ({ title, poster, sources }: MediaProps) => {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [vidSrc, setVidSrc] = useState<string>(
    (sources.find(source => source.quality === "default") ?? sources[0])?.url || ''
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const onCanPlay = () => {
        setIsReady(true);
        player.currentTime = currentTime;
        if (player.paused) {
          player.play().catch(error => console.error('Error playing video:', error));
        }
      };

      player.addEventListener('can-play', onCanPlay);

      // Clean up the event listener
      return () => {
        player.removeEventListener('can-play', onCanPlay);
      };
    }
  }, [vidSrc, currentTime]);

  const handleQualityChange = (newSrc: string): void => {
    const player = playerRef.current;
    if (player) {
      setCurrentTime(player.currentTime);
      setIsReady(false);
      setVidSrc(newSrc);
    }
  };

  return (
    <>
      <div className="lg:w-1/2">
        <h1 className="text-xl pb-1 font-black drop-shadow-lg text-center sm:text-left line-clamp-1">
          {title}
        </h1>
        <MediaPlayer className="" ref={playerRef} title={title} src={vidSrc}>
          <MediaProvider>
            <Poster
              className="vds-poster"
              src={`${poster}`}
              alt={`${title}`}
            />
          </MediaProvider>
          <DefaultVideoLayout thumbnails={poster} icons={defaultLayoutIcons} />
        </MediaPlayer>
        <Quality handleQualityChange={handleQualityChange} sources={sources} />
      </div>
    </>
  );
};
