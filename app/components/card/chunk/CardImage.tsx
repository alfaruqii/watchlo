"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CardImage({
  image,
  alt,
}: {
  image?: string;
  alt: string;
}) {
  const [isImageLoading, setImageLoading] = useState(true);
  const safeImage = image && image.trim() !== "" ? image : "/fallback-card.webp";
  const [imgSrc, setImgSrc] = useState<string>(safeImage);

  useEffect(() => {
    setImgSrc(image && image.trim() !== "" ? image : "/fallback-card.webp");
  }, [image]);

  return (
    <div className="relative mb-2 w-full aspect-[2/3] overflow-hidden rounded-sm border border-hairline/80 bg-surface-2">
      <figure className="relative h-full w-full overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 z-10 animate-pulse bg-surface-3" />
        )}
        <Image
          unoptimized
          fill
          sizes="(max-width: 640px) 144px, 208px"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            if (imgSrc !== "/fallback-card.webp") {
              setImgSrc("/fallback-card.webp");
            }
          }}
          className={`object-cover transition-custom-blur ${
            isImageLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
          } group-hover:scale-105 group-hover:duration-300`}
          src={imgSrc}
          alt={alt || "Card thumbnail"}
        />
      </figure>
    </div>
  );
}
