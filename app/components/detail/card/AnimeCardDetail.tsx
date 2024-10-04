'use client'

import { useState } from 'react'
import Link from "next/link"
import Image from 'next/image'

interface AnimeCardDetailProps {
  animeImage: string
  episodeId: string
  id: string
  episodeNumber: number
}

export const AnimeCardDetail = ({ animeImage, episodeId, id, episodeNumber }: AnimeCardDetailProps) => {
  const [isImageLoading, setImageLoading] = useState(true)
  const route = { pathname: `/anime/watch/${episodeId}`, query: { title: id, ep: episodeNumber } }

  return (
    <Link href={route}>
      <div className="group relative w-fit transform transition-transform duration-300 ease-out group-hover:scale-105 group-hover:drop-shadow-xl">
        <div className="card mb-1 h-44 w-32 max-h-44 overflow-hidden rounded sm:h-72 sm:w-52 sm:max-h-72">
          <figure className="relative h-full w-full overflow-hidden">
            {isImageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-700" />
            )}
            <Image
              unoptimized
              onLoad={() => setImageLoading(false)}
              className={`
                object-cover
                transition-custom-blur
                ${isImageLoading
                  ? 'scale-110 blur-2xl'
                  : 'scale-100 blur-0 group-hover:scale-110'
                }
                hover:scale-110 hover:duration-300
              `}
              src={animeImage}
              alt={id ?? "unknown"}
              fill
              sizes="(max-width: 768px) 128px, 208px"
            />
          </figure>
        </div>
        <p
          className={`
            line-clamp-2 truncate text-sm font-bold
            transition-opacity duration-500
            ${isImageLoading ? 'opacity-0' : 'opacity-100'}
          `}
        >
          Episode {episodeNumber}
        </p>
      </div>
    </Link>
  )
}
