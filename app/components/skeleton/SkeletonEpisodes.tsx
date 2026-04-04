import { Skeleton } from "@/components/ui/skeleton";

function SkeletonEpisodes({ noMargin }: { noMargin?: boolean } = { noMargin: false }) {
  return (
    <>
      <div className={`${noMargin ? "" : "p-4 mt-[5rem] sm:mt-[8rem]"}`}>
        <div className="flex embla__container gap-4 relative w-full overflow-x-scroll no-scrollbar">
          {
            Array(10).fill(0).map((i: number) => (
              <Skeleton key={i} className="max-h-44 min-h-44 min-w-32 rounded sm:max-h-72 sm:min-h-72 sm:min-w-52" />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default SkeletonEpisodes;
