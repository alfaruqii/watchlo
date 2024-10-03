import { MovieInfo } from "@/types/movies.type";

export const movieFixture: MovieInfo = {
  adult: false,
  backdrop_path: 'https://example.com/backdrop.jpg',
  genres: [
    { id: 18, name: 'Drama' },
    { id: 28, name: 'Action' },
  ],
  homepage: 'https://example.com/movie-homepage',
  id: 2,
  original_language: 'en',
  overview: 'Movie description overview goes here.',
  popularity: 5000,
  poster_path: 'https://example.com/poster.jpg',
  production_companies: [
    {
      id: 100,
      logo_path: 'https://example.com/company-logo.png',
      name: 'Production Company',
      origin_country: 'US',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'US',
      name: 'United States of America',
    },
  ],
  spoken_languages: [
    {
      english_name: 'English',
      iso_639_1: 'en',
      name: 'English',
    },
  ],
  status: 'Released',
  tagline: 'An exciting movie tagline!',
  vote_average: 7.8,
  vote_count: 1200,
  genre_names: ['Drama', 'Action'],

  // Movie specific fields
  original_title: 'Original Movie Title',
  release_date: '2021-12-01',
  revenue: 100000000,
  runtime: 120,
  title: 'Movie Title',
  video: false,
};


