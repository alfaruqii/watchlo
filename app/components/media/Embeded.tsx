import { getEnv } from "@/utils/getEnv"

type EmbededProps = {
  id: string;
  type: string;
}

function Embeded({ id, type }: EmbededProps) {
  const source = `${(getEnv("WATCHLO_SOURCE_EMBED") ?? process.env["NEXT_PUBLIC_WATCHLO_SOURCE_EMBED"])}/${type}/${id}`
  return (
    <>
      <div className="mt-4 flex flex-col items-center overflow-hidden">
        <p className="text-center w-full text-xl mb-2 font-bold">Watch 🎬</p>
        <iframe src={source ?? "https://www.youtube.com/embed/xvFZjo5PgG0?si=ANsa_ekk0Jg9zbWg"} referrerPolicy="origin" allowFullScreen className="rounded drop-shadow-lg"></iframe>
      </div>
    </>
  )
}

export default Embeded
