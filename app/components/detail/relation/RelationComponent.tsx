import { AnimeContainerCard } from "@/components/card/animecard/AnimeContainerCard";
import { Relation } from "@/types/anime.type";

function RelationComponent({ relation }: { relation: Relation[] }) {
  const filteredRelation = relation.filter((i) => (i.format === "TV" || i.format === "MOVIE" || i.format === "SPECIAL"));
  return (
    <>
      <div>
        <AnimeContainerCard animes={filteredRelation} containerTitle="Relation 🧩" />
      </div>
    </>
  )
}

export default RelationComponent
