import { Skeleton } from "@/components/ui/skeleton";

function SkeletonSearch() {
  return (
    <>
      <div className="p-4">
        <div className="no-scrollbar relative flex w-full flex-col gap-4 overflow-x-scroll">
          {Array(10)
            .fill(0)
            .map((_, k) => (
              <>
                <div key={k} className="flex gap-2 rounded p-3">
                  <Skeleton className="line-clamp-1 h-36 w-32 max-w-full font-magnatbold text-white sm:text-xl lg:text-2xl" />
                  <div className="flex w-5/6 flex-col gap-1">
                    <Skeleton className="h-3 w-20" />
                    <div className="flex items-center gap-1 text-sm">
                      <Skeleton className="h-2 w-8" />
                      <Skeleton className="h-2 w-8" />
                    </div>
                    <Skeleton className="h-2 w-12" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
}

export default SkeletonSearch;
