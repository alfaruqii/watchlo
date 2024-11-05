import SkeletonEpisodeNum from "@/components/skeleton/SkeletonEpisodeNum";
import SkeletonMediaPlayer from "@/components/skeleton/SkeletonMediaPlayer";

function Loading() {
  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:grid lg:grid-cols-5">
        <SkeletonMediaPlayer />
        <SkeletonEpisodeNum />
      </div>
    </>
  );
}

export default Loading;
