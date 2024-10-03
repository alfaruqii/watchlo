import Link from "next/link";
import Image from 'next/image';

interface AnimeCardDetailProps {
  animeImage: string;
  episodeId: string;
  id: string;
  episodeNumber: number;
}

export const AnimeCardDetail = ({ animeImage, episodeId, id, episodeNumber }: AnimeCardDetailProps) => {
  const route = { pathname: `/anime/watch/${episodeId}`, query: { title: id, ep: episodeNumber } };

  return (
    <>
      <Link href={route}>
        <div key={id} className="group relative transition-transform duration-300 w-fit ease-out transform group-hover:scale-105 group-hover:drop-shadow-xl">
          <div className="card mb-1 max-h-44 h-44 w-32 overflow-hidden rounded sm:max-h-72 sm:h-72 sm:w-52">
            <figure className="relative w-full h-full overflow-hidden">
              <Image
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                src={animeImage}
                alt={id ?? "unknown"}
                layout="responsive"   // Responsive layout for better scaling
                width={300}           // The aspect ratio remains as the image scales
                height={300}
                sizes="(max-width: 768px) 100vw, 33vw"  // Use appropriate sizes for different viewports
              />
            </figure>
          </div>
          <p className="line-clamp-2 text-sm font-bold truncate">Episode {episodeNumber}</p>
        </div>
      </Link>
    </>
  );
};

