import Image from "next/image";
import RatingComponent from "../rating/RatingComponent";
import ButtonWatch from "./ButtonWatch";
import { formatDesc } from "@/utils/formatted";
import fallbackDesc from "@/utils/fallbackDesc.json";
import { Seasons, TVInfo } from "@/types/movies.type"

function SeasonComponent({ data }: { data: TVInfo }) {
  const now = Date.now();

  const alreadyReleased = (season: Seasons): boolean => {
    return !!(season.air_date &&
      new Date(season.air_date).getTime() < now)
  }

  const doesNameSameLikeSeason = (season: Seasons): boolean => {
    return `season ${season.season_number}` === season.name?.toLowerCase();
  }

  const filteredSeason = data.seasons.filter((season: Seasons) => {
    return (
      season.season_number !== 0 &&
      season.episode_count > 0 &&
      (season.air_date ??
        new Date(season.air_date).getTime() < now)
    );
  });

  return (
    <>
      <div className="overflow-hidden">
        <p className="mb-2 mt-4 w-full text-center text-xl font-bold">Seasons 📽️</p>
        <div className="scrollbar-w-8 scrollbar-thumb-rounded-full scrollbar-track-rounded-full max-h-[23rem] overflow-y-scroll rounded scrollbar scrollbar-track-gray-400 scrollbar-thumb-gray-900 ">
          {
            filteredSeason.map((season) => (
              <>
                <div className="collapse collapse-arrow mb-1 rounded bg-base-200 font-bold drop-shadow-lg lg:mb-3" key={season.season_number}>
                  <div className="absolute inset-0 z-0 h-full w-full">
                    <Image
                      src={season.poster_path ?? data.poster_path ?? "/fallback-card.webp"}
                      alt={data.name}
                      fill
                      className="rounded object-cover "
                    />
                    <div className="absolute h-full w-full bg-gradient-to-r from-black/80 via-black/50 to-black/40" ></div>
                  </div>
                  <input type="radio" name="my-accordion-2" className="z-20" defaultChecked />
                  <div className="collapse-title relative z-10 text-lg font-medium text-white">Season {season.season_number} {season.name && <p className={`${doesNameSameLikeSeason(season) ? "hidden" : "text-xs line-clamp-1"}`}>({season.name})</p>}</div>
                  <div className="collapse-content relative z-10 flex gap-2 text-white">
                    {/* Parent container with defined size and relative position */}
                    <div className="flex flex-col gap-2">
                      <p className="line-clamp-2 text-sm">{formatDesc(season.overview || data.overview || fallbackDesc)}</p>
                      {
                        alreadyReleased(season) ?
                          <>
                            <RatingComponent score={season.vote_average} />
                            <ButtonWatch text="Watch" season={season.season_number} ep={1} id={data.id} />
                          </>
                          :
                          <ButtonWatch text="Not Yet Released" />
                      }
                    </div>
                  </div>
                </div >
              </>
            ))
          }
        </div >
      </div>
    </>
  );
}

export default SeasonComponent;

