import { getEnv } from "@/utils/getEnv";

type EmbededProps = {
  id: string;
  type: "movie" | "tv";
  season?: string;
  ep?: string;
};

function Embeded({ id, type, season = "1", ep = "1" }: EmbededProps) {
  const determinePathQuery = (): string => {
    if (type.toLowerCase() === "tv") return `/tv/${id}/${season}/${ep}`;
    return `/movie/${id}`;
  };

  const source = `${
    getEnv("WATCHLO_SOURCE_EMBED") ??
    process.env["NEXT_PUBLIC_WATCHLO_SOURCE_EMBED"]
  }${determinePathQuery()}`;
  return (
    <>
      <div
        className={`mt-4 flex flex-col items-center overflow-hidden w-full ${
          type.toLowerCase() === "tv" ? "col-span-3" : ""
        }`}
      >
        {type.toLowerCase() === "movie" && (
          <p className="text-center w-full text-xl mb-2 font-bold">Watch 🎬</p>
        )}
        <iframe
          src={
            source ??
            "https://www.youtube.com/embed/xvFZjo5PgG0?si=ANsa_ekk0Jg9zbWg"
          }
          referrerPolicy="origin"
          allowFullScreen
          className="rounded drop-shadow-lg"
        ></iframe>
      </div>
    </>
  );
}

export default Embeded;
