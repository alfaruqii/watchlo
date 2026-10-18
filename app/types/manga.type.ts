import { Title, CoverImage, Date } from "./anime.type";

export type MangaSubtype = "all" | "manga" | "manhwa" | "manhua";

export interface MangaItem {
  id: number;
  idMal?: number | null;
  title: Title;
  format?: string;
  subtype?: "manga" | "manhwa" | "manhua";
  countryOfOrigin?: string;
  description?: string;
  coverImage?: CoverImage;
  bannerImage?: string | null;
  genres?: string[];
  tags?: Array<{ id: number; name: string }>;
  status?: string;
  chapters?: number | null;
  volumes?: number | null;
  year?: number | null;
  score?: {
    averageScore?: number | null;
    decimalScore?: number | null;
  };
  popularity?: number;
  image?: string;
}

export interface MangaChapter {
  id: string;
  chapter: string;
  number: number;
  title?: string;
  language: string;
  provider: string;
  scanlationGroup?: string;
  publishedAt?: string;
}

export interface MangaPage {
  page: number;
  url: string;
  rawUrl?: string;
  referer?: string;
}

export interface MangaReadResult {
  code?: number;
  message?: string;
  chapterId: string;
  provider?: string;
  totalPages: number;
  pages: MangaPage[];
}

export interface MangaChaptersResponse {
  anilistId: number;
  totalChapters: number;
  availableLanguages: string[];
  providers: string[];
  chapters: MangaChapter[];
}

export interface MangaDetailInfo extends MangaItem {
  synonyms?: string[];
  startIn?: Date;
  endIn?: Date;
  siteUrl?: string;
  staff?: Array<{
    id: number;
    name: string;
    role: string;
  }>;
  relation?: Array<{
    id: number;
    relationType: string;
    title: Title;
    format: string;
    type: "ANIME" | "MANGA";
    status: string;
    coverImage: CoverImage;
  }>;
  id_provider?: Record<string, string>;
}
