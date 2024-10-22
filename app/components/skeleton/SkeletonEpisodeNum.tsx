function SkeletonEpisodeNum() {
  return (
    <div className="flex flex-col pt-1.5 col-span-2">
      <div className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto scrollbar scrollbar-track-gray-300 scrollbar-thumb-gray-800 p-2">
        {Array(18)
          .fill(0)
          .map((_: number, i: number) => (
            <div key={i} className="skeleton h-10 w-full"></div>
          ))}
      </div>
    </div>
  );
}

export default SkeletonEpisodeNum;
