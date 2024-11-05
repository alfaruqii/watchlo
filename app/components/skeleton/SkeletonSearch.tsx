function SkeletonSearch() {
  return (
    <>
      <div className="p-4">
        <div className="no-scrollbar relative flex w-full flex-col gap-4 overflow-x-scroll">
          {Array(10)
            .fill(0)
            .map((i: number) => (
              <>
                <div key={i} className="flex gap-2 rounded p-3">
                  <div className="skeleton line-clamp-1 h-36 w-32 max-w-full font-magnatbold text-white sm:text-xl lg:text-2xl"></div>
                  <div className="flex w-5/6 flex-col gap-1">
                    <div className="skeleton h-3 w-20"></div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="skeleton h-2 w-8"></span>
                      <span className="skeleton h-2 w-8"></span>
                    </div>
                    <div className="skeleton h-2 w-12"></div>
                    <div className="skeleton h-2 w-12"></div>
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
