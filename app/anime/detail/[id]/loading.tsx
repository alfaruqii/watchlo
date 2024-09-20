import SkeletonEpisodes from '@/components/skeleton/SkeletonEpisodes';
import SkeletonHeroBanner from '@/components/skeleton/SkeletonHeroBanner';
import SkeletonText from '@/components/skeleton/SkeletonText';

function loading() {
  return (
    <>
      <SkeletonHeroBanner />
      <SkeletonText />
      <SkeletonEpisodes />
    </>
  )
}

export default loading
