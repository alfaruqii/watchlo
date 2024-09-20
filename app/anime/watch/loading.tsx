import SkeletonEpisodeNum from '@/components/skeleton/SkeletonEpisodeNum';
import SkeletonMediaPlayer from '@/components/skeleton/SkeletonMediaPlayer';

function loading() {
  return (
    <>
      <div className="flex flex-col gap-6 p-6 lg:flex-row">
        <SkeletonMediaPlayer />
        <SkeletonEpisodeNum />
      </div>
    </>
  )
}

export default loading

