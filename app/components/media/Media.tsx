"use client";
import { StreamInfo } from '@/app/types/anime.type';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { useRef, useState, useEffect } from 'react';

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
  const [_, setIsReady] = useState<boolean>(false);

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

  const handleQualityChange = (newSrc: string) => {
    const player = playerRef.current;
    if (player) {
      setCurrentTime(player.currentTime);
      setIsReady(false);
      setVidSrc(newSrc);
    }
  };

  return (
    <>
      <div className="sm:w-1/2">
        <MediaPlayer ref={playerRef} title={title} src={vidSrc}>
          <MediaProvider >
            <Poster
              className="vds-poster"
              src={`${poster}`}
              alt={`${title}`}
            />
          </MediaProvider>
          <DefaultVideoLayout thumbnails={poster} icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">Quality video</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
          {
            sources.map((source) => (
              <li key={source.quality} onClick={() => handleQualityChange(source.url)}>
                <a>{source.quality}</a>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  );
};
