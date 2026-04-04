import { Skeleton } from "@/components/ui/skeleton";

function SkeletonHeroBanner() {
  return (
    <>
      <Skeleton className="max-h-44 min-h-44 min-w-32 rounded sm:max-h-72 sm:min-h-72 sm:min-w-52" />
    </>
  )
}

export default SkeletonHeroBanner
