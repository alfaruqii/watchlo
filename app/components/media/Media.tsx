import { StreamInfo } from "@/types/anime.type";
import {
  Gesture,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  Poster,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import Hls, { ErrorData, Events } from "hls.js";
import { useRef, useState, useEffect } from "react";
import Quality from "../quality/Quality";
import useSWR from "swr";
import SkeletonMediaPlayer from "../skeleton/SkeletonMediaPlayer";

interface MediaProps {
  poster: string;
  title: string;
  episodeId: string;
  ep: string;
}

const fetchAnimeStream = async (episodeId: string | null) => {
  if (!episodeId) return null;
  const res = await fetch(`/api/animestream?query=${episodeId}`);
  return res.json();
};

const Media = ({ title, poster, episodeId, ep }: MediaProps) => {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [vidSrc, setVidSrc] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const previousEp = useRef<string | null>("");

  const {
    data: streamInfo,
    error: errorStream,
    isLoading,
  } = useSWR<StreamInfo>(() => episodeId || null, fetchAnimeStream);

  useEffect(() => {
    if (previousEp.current !== null && previousEp.current !== ep) {
      setCurrentTime(0);
    }
    previousEp.current = ep;
  }, [ep]);

  useEffect(() => {
    if (streamInfo?.sources && streamInfo?.sources.length > 0) {
      const defaultSource =
        streamInfo?.sources.find((source) => source.quality === "default") ??
        streamInfo?.sources[0];
      setVidSrc(defaultSource.url);
    }
  }, [episodeId, streamInfo?.sources]);

  useEffect(() => {
    if (!vidSrc) return;

    const player = playerRef.current;
    if (!player) return;

    const initializeHls = () => {
      if (!Hls.isSupported() || !vidSrc.includes(".m3u8")) return;

      const hls = new Hls({
        maxBufferSize: 30 * 1000 * 1000,
        enableWorker: true,
        startLevel: -1,
        lowLatencyMode: true,
        backBufferLength: 90,
        abrEwmaDefaultEstimate: 1000000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 20000,
      });

      hls.loadSource(vidSrc);

      const checkProviderAndInitialize = () => {
        if (!player.provider) {
          requestAnimationFrame(checkProviderAndInitialize);
          return;
        }

        const mediaElement =
          player.provider?.type === "video" || player.provider?.type === "hls"
            ? player.provider?.video
            : null;

        if (!mediaElement) {
          console.error("No media element found");
          return;
        }

        hls.attachMedia(mediaElement);

        hls.on(Events.MANIFEST_PARSED, () => {
          player.currentTime = currentTime;
          player.play().catch((playError: Error) => {
            console.error("Error playing video:", playError);
          });
        });

        hls.on(Hls.Events.ERROR, (_event: Events, data: ErrorData) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                initializeHls();
                break;
            }
          }
        });

        hlsRef.current = hls;
      };

      checkProviderAndInitialize();
    };

    initializeHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [vidSrc, currentTime]);

  const handleQualityChange = (newSrc: string): void => {
    const player = playerRef.current;
    if (player) {
      setCurrentTime(player.currentTime);
      setVidSrc(newSrc);
    }
  };

  if (errorStream) {
    return (
      <div className="col-span-3">There is an error in our application :[</div>
    );
  }

  if (episodeId && isLoading) {
    return <SkeletonMediaPlayer />;
  }

  if (!episodeId || !streamInfo?.sources || streamInfo?.sources.length === 0) {
    return <div className="col-span-3">No video sources available</div>;
  }

  return (
    <div className="lg:col-span-3">
      <h1 className="line-clamp-1 pb-1 text-center text-xl font-black drop-shadow-lg sm:text-left">
        {title}
      </h1>
      <MediaPlayer
        autoPlay
        ref={playerRef}
        title={title}
        src={vidSrc}
        load="eager"
        posterLoad="eager"
      >
        <MediaProvider>
          <Poster className="vds-poster" src={poster} alt={title} />
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
        <Gesture
          className="absolute inset-0 z-10 block h-full w-1/5"
          event="dblpointerup"
          action="seek:-10"
        />
        <Gesture
          className="absolute inset-0 z-10 block h-full w-1/5"
          event="dblpointerup"
          action="seek:10"
        />
        <DefaultVideoLayout thumbnails={poster} icons={defaultLayoutIcons} />
      </MediaPlayer>
      <Quality
        handleQualityChange={handleQualityChange}
        sources={streamInfo?.sources}
      />
    </div>
  );
};

export default Media;
