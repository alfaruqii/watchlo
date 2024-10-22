import React from "react";

function SkeletonMediaPlayer() {
  return (
    <>
      <div className="lg:col-span-3 flex flex-col gap-3">
        <div className="h-52 skeleton sm:h-96 lg:h-[28rem]"></div>
        <div className="h-11 skeleton w-32"></div>
      </div>
    </>
  );
}

export default SkeletonMediaPlayer;
