import Link from "next/link"
import { Button } from "@/components/ui/button"

function ButtonWatch({ text, season, ep = 1, id }: { text: string; season?: number; ep?: number; id?: number; isAnime?: boolean }) {
  const routes = { pathname: `/series/watch`, query: { id: id, season, ep } };
  return (
    <>
      {
        id ?
          <Button asChild size="sm" className="w-fit font-bold md:text-lg">
            <Link href={routes}>{text}</Link>
          </Button> :
          <Button type="button" size="sm" className={`w-fit font-bold md:text-lg ${text.toLowerCase().includes("not yet released") ? "pointer-events-none" : ""}`}>{text}</Button>
      }
    </>
  )
}

export default ButtonWatch
