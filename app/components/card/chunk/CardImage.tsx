import Image from 'next/image'

export default function CardImage({ image, alt }: { image: string, alt: string }) {
  return (
    <>
      <div className="card mb-1 max-h-44 h-44 w-32 overflow-hidden rounded sm:max-h-72 sm:h-72 sm:w-52">
        <figure className="relative h-full w-full overflow-hidden">
          <Image
            className="max-h-44 min-h-44 object-cover transition-transform duration-300 ease-out group-hover:scale-110 sm:min-h-72 sm:min-w-52"
            width={200}
            height={300}
            src={image ?? "/fallback-card.webp"}
            alt={alt ?? "unknown"}
          />
        </figure>
      </div>
    </>
  )
}
