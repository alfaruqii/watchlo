import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Rate({ rate = "unknown" }: { rate: string }) {
  const formattedRate =
    rate && rate !== "undefined" && rate !== "NaN" ? rate : "NR";

  return (
    <Badge
      variant="secondary"
      className="inline-flex shrink-0 w-fit items-center gap-1 rounded-sm border border-hairline bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gold tabular-nums"
    >
      <Star className="size-2.5 shrink-0 fill-gold text-gold" />
      <span>{formattedRate}</span>
    </Badge>
  );
}

export default Rate;
