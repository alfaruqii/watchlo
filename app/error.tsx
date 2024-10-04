"use client";
import Image from "next/image";

function Error() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4">
        <Image unoptimized src="/fallback-card.webp" alt="Windah Batubara" className="rounded drop-shadow-lg" width={200} height={200} />
        <p className="text-center text-lg">There is an error :/ please contact me if you were concern at my github, or create an issue, thanks :]</p>
      </div>
    </>
  )
}

export default Error
