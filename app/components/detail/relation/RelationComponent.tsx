import AnimeContainerCard from "@/components/card/animecard/AnimeContainerCard";
import { RelationOrRecommendation } from "@/types/anime.type";

function RelationComponent({
  relation,
}: {
  relation: RelationOrRecommendation[];
}) {
  const filteredRelation = relation.filter(
    (i) => i.format === "TV" || i.format === "MOVIE" || i.format === "SPECIAL"
  );
  return (
    <>
      <div className="pt-4">
        {filteredRelation.length > 0 && (
          <AnimeContainerCard
            animes={filteredRelation}
            containerTitle="Relation 🧩"
          />
        )}
      </div>
    </>
  );
}

export default RelationComponent;
