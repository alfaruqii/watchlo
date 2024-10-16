import { AnimeServiceV1 } from "@/services";
import { IdProvider } from "@/types/anime.type"

/**
 * Extracts the ID without "-dub" if present.
 * @param id - The ID string to process.
 * @returns The cleaned ID string.
 */
export const stripDub = (id: string): string => {
  return id.replace(/-dub$/, '');
};

export const addDub = (id: string): string => {
  return `${id}-dub`;
}

/**
 * Just execute if the id gogo is not the same 
 * @returns The correct idProvider for gogo.
 */
export const providerCheckerGogo = (provider: IdProvider): IdProvider => {
  const { idGogo, idGogoDub } = provider;
  const idGogoActualDub = addDub(idGogoDub);
  if (idGogo && idGogoDub && idGogo !== stripDub(idGogoDub)) {
    return {
      ...provider,
      idGogo: idGogoDub,
      idGogoDub: idGogoActualDub,
    }
  }
  return provider;
}
