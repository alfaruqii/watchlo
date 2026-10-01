import { Badge } from "@/components/ui/badge";

function Genre({ genre }: { genre: string }) {
  return (
    <Badge
      variant="outline"
      className="border-[#f2ece1]/30 bg-[#14120f] px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-[#f2ece1]"
    >
      {genre}
    </Badge>
  );
}

export default Genre;
