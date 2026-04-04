import { Skeleton } from "@/components/ui/skeleton";

function SkeletonText() {
  return (
    <>
      <div className="grid gap-2 p-6 pt-14 sm:grid-cols-2 sm:gap-4 sm:px-10 sm:pt-20">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div >
    </>
  )
}

export default SkeletonText
