import SkeletonEpisodes from '@/components/skeleton/SkeletonEpisodes'
import SkeletonHeroBanner from '@/components/skeleton/SkeletonHeroBanner'

function loading() {
  return (
    <>
      <SkeletonHeroBanner />
      <SkeletonEpisodes />
      <SkeletonEpisodes />
    </>
  )
}

export default loading
