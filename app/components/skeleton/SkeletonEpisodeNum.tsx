function SkeletonEpisodeNum() {
  return (
    <>
      <div className="lg:max-w-[50%] flex flex-col pt-1.5">
        <div className="flex flex-wrap gap-2 scrollbar scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-800 scrollbar-track-gray-300 max-h-96 2xl:max-h-[30rem] overflow-y-scroll ">
          {
            Array(18).fill(0).map((_: number, i: number) => (
              <div key={i} className="min-w-24 skeleton h-10"></div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default SkeletonEpisodeNum
