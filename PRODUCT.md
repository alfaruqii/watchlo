# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Casual viewers, cinephiles, and anime enthusiasts (otaku) who want to discover curated Movies, TV Series, and Anime and jump straight into watching without registration walls, clutter, or intrusive ad traps. They browse both at night in dim environments and during daytime breaks across desktop and mobile web.

## Product Purpose

Watchlo is a unified, frictionless streaming and discovery web application that brings together Western/global cinema & television (via TMDB) and Japanese animation (via AniList and streaming providers) under one roof. Success means a visitor can immediately grasp what is worth watching right now, inspect rich context (trailers, ratings, genres, seasons, episodes, relations, reviews), and start playback in one or two clicks.

## Positioning

Unlike fragmented piracy sites or bloated corporate streaming portals that lock catalogs behind accounts and repetitive horizontal carousels, Watchlo unifies Movies, TV Series, and Anime in a single curated editorial-cinema experience with instant multi-provider playback and zero sign-up friction.

## Operating Context

- **Routes & Workflows**:
  - `/` — Movies & TV Series discovery (featured hero showcase, trending movies, top-rated movies, trending series, top-rated series).
  - `/anime` — Anime discovery (featured trending anime showcase, recently updated episodes, most popular anime).
  - `/movie/detail/[id]`, `/series/detail/[id]`, `/anime/detail/[id]` — Deep media dossier (synopses, ratings, studio/production metadata, trailers, season/episode selectors, related & recommended works, user reviews).
  - `/movie/watch/[id]`, `/series/watch`, `/anime/watch` — Focused screening room with multi-provider switcher (`vidsrc`, `autoembed`, etc.) and HLS/M3U8 playback (`@vidstack/react`) with episode navigation.
  - `/docs` & Quick Docs Modal — Transparent technical documentation and user guidance (e.g., DNS / ad-blocker recommendations for third-party embeds).
  - Global Command/Search Modal — Instant cross-catalog search switching contextually between Movies/TV and Anime.

## Capabilities and Constraints

- **Stack**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Zustand (`themeStore`, `modalStore`, `episodeStore`), SWR, Radix UI / `shadcn/ui` primitives, Vidstack player + `hls.js`.
- **Backend Services**:
  - `WATCHLO_API_V0` (`watchlo-api`): TMDB proxy for Movies & TV Series.
  - `WATCHLO_API_V2` (`watchlo-anime-apiv2`): AniList GraphQL proxy for Anime metadata, trending, popular, recommendations, and search.
  - `WATCHLO_API_V1` (`animemilo-api`): Episode stream provider (with graceful fallback when upstream Gogoanime is unavailable).
- **Theme Support**: Supports dual theme switching (`black` dark theme and `garden` light theme) persisted in `localStorage` via `useThemeStore`.

## Brand Commitments

- **Explicit Anti-Reference**: Never use the cliché Netflix aesthetic (pure black `#000000` with `#E50914` red accents and monotonous wall-to-wall generic poster grids). The user explicitly rejected Netflix-style theming as boring.
- **Name & Identity**: Watchlo — an independent, tasteful screening room and media archive.

## Evidence on Hand

- Live TMDB movie and TV series data, high-resolution backdrops, posters, trailers, seasons, episodes, and reviews via `MovieService`.
- Live AniList anime metadata, cover art, banner imagery, studios, scores, relations, and recommendations via `AnimeServiceV2`.
- Existing brand marks in `public/logo.png` and fallback art in `public/fallback-card.webp`.

## Product Principles

1. **Curated Screening Room Over Algorithmic Landfill**: Present films, series, and anime like a physical film festival program or criterion archive rather than a generic content farm.
2. **Zero-Friction Playback**: Keep the path from discovery to the screening room (`Watch`) immediate, legible, and free of unnecessary intermediate steps.
3. **Atmospheric Dual-Mode Craft**: Both dark and light modes must feel intentionally art-directed—tactile, high-contrast, and easy on the eyes during long browsing or viewing sessions.
4. **Honest Metadata Density**: Surface year, format, genres, ratings, episode counts, and studio/season context with crisp typographic hierarchy rather than burying them or cluttering cards.
