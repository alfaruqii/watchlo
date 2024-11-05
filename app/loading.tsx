import SkeletonEpisodes from '@/components/skeleton/SkeletonEpisodes'
import SkeletonHeroBanner from '@/components/skeleton/SkeletonHeroBanner'

function loading() {
  return (
    <>
      <SkeletonHeroBanner />
      <SkeletonEpisodes />
      <SkeletonEpisodes />
      <SkeletonEpisodes />
      <SkeletonEpisodes />
    </>
  )
}

export default loading
