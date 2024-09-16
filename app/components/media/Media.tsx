// Media.tsx
import { StreamInfo } from '@/app/types/anime.type';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

interface MediaProps extends StreamInfo {
  thumbnails: string;
  title: string;
}

export const Media = ({ title, thumbnails, sources }: MediaProps) => {
  // Extract the first available source (or choose based on logic like quality)
  const videoSource = sources[0]?.url || ''; // Make sure there is a source available

  return (
    <>
      <div>
        <MediaPlayer title={title} src={videoSource}>
          <MediaProvider />
          <DefaultVideoLayout thumbnails={thumbnails} icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>
    </>
  );
};

