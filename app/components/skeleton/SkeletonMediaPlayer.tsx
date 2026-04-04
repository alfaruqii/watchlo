import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonMediaPlayer() {
  return (
    <>
      <div className="lg:col-span-3 flex flex-col gap-3">
        <Skeleton className="h-52 sm:h-96 lg:h-[28rem]" />
        <Skeleton className="h-11 w-32" />
      </div>
    </>
  );
}

export default SkeletonMediaPlayer;
