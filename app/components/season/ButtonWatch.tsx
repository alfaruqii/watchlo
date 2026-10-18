import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

function ButtonWatch({
  text,
  season,
  ep = 1,
  id,
}: {
  text: string;
  season?: number;
  ep?: number;
  id?: number;
  isAnime?: boolean;
}) {
  const routes = { pathname: `/series/watch`, query: { id: id, season, ep } };
  return (
    <>
      {id ? (
        <Button asChild size="sm" className="w-fit font-display font-bold">
          <Link href={routes}>
            <Play className="size-3.5 fill-current" strokeWidth={2} />
            <span>{text}</span>
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className={`w-fit font-display font-bold ${
            text.toLowerCase().includes("not yet released")
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          {text}
        </Button>
      )}
    </>
  );
}

export default ButtonWatch;
