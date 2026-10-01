import { Badge } from "@/components/ui/badge";

function SearchedGenre({ genre }: { genre: string }) {
  return (
    <Badge
      variant="secondary"
      className="border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground"
    >
      {genre}
    </Badge>
  );
}

export default SearchedGenre;
