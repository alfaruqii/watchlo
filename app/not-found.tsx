"use client";
import Image from "next/image";

function NotFound() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4">
        <Image unoptimized src="/fallback-card.webp" alt="Windah Batubara" className="rounded drop-shadow-lg" width={200} height={200} />
        <p className="text-center text-lg">The page that you looking for is not exist, miaw miaw 💀</p>
      </div>
    </>
  )
}

export default NotFound

