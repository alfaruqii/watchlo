import Link from "next/link";
import Image from 'next/image'

interface AnimeCardDetailProps {
  animeImage: string;
  episodeId: string;
  id: string;
  episodeNumber: number;
}

export const AnimeCardDetail = ({ animeImage, episodeId, id, episodeNumber }: AnimeCardDetailProps) => {
  const route = { pathname: `/anime/watch/${episodeId}`, query: { animeTitle: id, ep: episodeNumber } };

  return (
    <>
      <Link href={route}>

        <div key={id} className="group relative transition-transform duration-300 ease-out transform group-hover:scale-105 group-hover:drop-shadow-xl">
          <div className="card mb-1 max-h-44 min-h-44 min-w-32 overflow-hidden rounded sm:max-h-72 sm:min-h-72 sm:min-w-52">
            <figure className="relative w-full h-full overflow-hidden">
              <Image
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                width={2000}
                height={2000}
                src={animeImage}
                alt={id ?? "unknown"}
              />
            </figure>
          </div>
          <p className="line-clamp-2 text-sm font-bold">Episode {episodeNumber}</p>
        </div>
      </Link>
    </>
  );
};


