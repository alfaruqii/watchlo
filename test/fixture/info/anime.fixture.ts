import { AnimePopular, AnimeTrending } from "@/types/anime.type";
import { AnimeInfo } from "@/types/anime.type";

export const animeFixture: AnimeInfo = {
  id: 1,
  code: 200,
  message: 'Success',
  idMal: 1,
  id_provider: {
    idGogo: 'gogo_id',
    idGogoDub: 'gogo_dub_id',
    idZoro: 'zoro_id',
    id9anime: '9anime_id',
    idPahe: 'pahe_id',
  },
  title: {
    userPreferred: 'Anime Title',
    romaji: 'Romaji Title',
    english: 'English Title',
    native: 'Native Title',
  },
  dub: true,
  description: 'This is an anime description.',
  coverImage: {
    large: 'https://example.com/cover-large.jpg',
    medium: 'https://example.com/cover-medium.jpg',
    color: 'https://example.com/cover-color.jpg',
  },
  bannerImage: 'https://example.com/banner.jpg',
  genres: ['Action', 'Adventure'],
  tags: [
    { id: 1, name: 'Adventure' },
    { id: 2, name: 'Fantasy' },
  ],
  status: 'FINISHED',
  format: 'TV',
  episodes: 24,
  year: 2020,
  season: 'FALL',
  duration: 24,
  startIn: { year: 2020, month: 10, day: 1 },
  endIn: { year: 2021, month: 3, day: 27 },
  nextair: null,
  score: {
    averageScore: 85,
    decimalScore: 8.5,
  },
  popularity: 120000,
  siteUrl: 'https://example.com/anime',
  trailer: {
    id: 'trailer1',
    site: 'YouTube',
    thumbnail: 'https://example.com/trailer-thumbnail.jpg',
  },
  studios: [
    { name: 'Studio Example' }
  ],
  relation: [],
};

export const popularAnime: AnimePopular = {
  id: '1',
  title: {
    userPreferred: 'My Popular Anime',
    romaji: 'Popular Anime Romaji',
    english: 'Popular Anime English',
    native: '人気アニメ',
  },
  coverImage: {
    large: 'http://example.com/popular.jpg',
  },
  status: 'RELEASING',
};

export const trendingAnime: AnimeTrending = {
  id: '2',
  title: 'My Trending Anime',
  image: 'http://example.com/trending.jpg',
  episodeNumber: 5,
  episodeId: 'episode-5',
};

