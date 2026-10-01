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
  const cleanYear =
    year && year !== "NaN" && year !== "undefined" ? year : "ARCHIVE";
  const cleanGenre =
    genre && genre !== "undefined" ? genre : "Repertory";

  return (
    <div className="mt-1.5 flex w-full items-center justify-between gap-1.5 border-t border-hairline/70 pt-1.5">
      <div className="flex min-w-0 items-center gap-1 font-mono text-[10px] text-muted-foreground tabular-nums sm:text-[11px]">
        <span className="shrink-0">{cleanYear}</span>
        <span aria-hidden="true" className="shrink-0">·</span>
        <span className="truncate font-sans text-xs capitalize text-muted-foreground" title={cleanGenre}>
          {cleanGenre}
        </span>
      </div>
      <div className="shrink-0">
        <Rate rate={rating} />
      </div>
    </div>
  );
}

export default SmallInfo;
