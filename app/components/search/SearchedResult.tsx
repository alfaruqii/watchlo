import Image from "next/image";
import { SearchedAnime } from "@/types/anime.type";
import Link from "next/link";
import { useThemeStore } from "@/store/themeStore";

function SearchedResult(props: SearchedAnime) {
  const { theme } = useThemeStore();
  const imgSrc = props.coverImage?.large ?? props.coverImage?.medium ?? props.coverImage?.color ?? props.bannerImage;
  const alt = props.title?.userPreferred ?? props.title?.english ?? props.title?.native ?? props.title?.romaji;
  return (
    <Link href={`/anime/detail/${props.id}`} className={`${theme === "garden" ? "hover:bg-gray-400 " : "hover:bg-gray-800"} rounded p-3`}>
      <div className="w-full flex gap-2">
        <div className="relative w-32 h-36">
          <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover rounded" // Set both width and height
          />
        </div>
        <div className="flex flex-col gap-1 w-5/6">
          <p className="font-bold line-clamp-2">{props.title.userPreferred}</p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-sm">{props.format ?? "unknown"}</span> | <span className="text-sm">{props.seasonYear ?? "unknown"}</span>
          </div>
          <div className="flex gap-1">
            {
              props.genres?.slice(0, 2).map((genre: string, i: number) => (<span className={`text-xs rounded-sm p-1 ${theme === "garden" ? "bg-gray-700 text-gray-100" : "bg-gray-400 text-gray-900"}`} key={i}>{genre}</span>))
            }
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchedResult;

