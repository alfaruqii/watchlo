import Rate from "./Rate";

function SmallInfo({
  year = "unknown",
  genre = "unknown",
  rating = "unknown",
}: {
  year: string;
  genre: string;
  rating: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
      <div className="flex h-fit items-center gap-1">
        <p className="text-xs capitalize">{year}</p>◦
        <p className="line-clamp-1 text-xs capitalize">{genre}</p>
      </div>
      <Rate rate={rating} />
    </div>
  );
}

export default SmallInfo;
