import Link from "next/link"

function ButtonWatch({ text, season, ep = 1, id }: { text: string; season?: number; ep?: number; id?: number; isAnime?: boolean }) {
  const routes = `/series/watch/${id}/season/${season}/ep/${ep}`;
  return (
    <>
      {
        id ?
          <Link href={routes}>
            <button type="button" className="btn btn-sm w-fit rounded border-none font-bold md:text-lg">{text}</button>
          </Link> :
          <button type="button" className={`btn btn-sm w-fit rounded border-none font-bold md:text-lg ${text.toLowerCase().includes("not yet released") ? "pointer-events-none" : ""}`}>{text}</button>
      }
    </>
  )
}

export default ButtonWatch
