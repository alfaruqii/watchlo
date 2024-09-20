function SkeletonText() {
  return (
    <>
      <div className="grid gap-2 p-6 pt-14 sm:grid-cols-2 sm:gap-4 sm:px-10 sm:pt-20">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-72 w-full"></div>
        </div>
      </div >
    </>
  )
}

export default SkeletonText
