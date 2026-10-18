# Watchlo

Watchlo is a media catalog and screening room for cinema, television series, anime, and manga. It combines metadata from TMDB and AniList with multi-provider video playback and automated chapter skipping.

The application runs on Next.js 15 (App Router), React 19, and Tailwind CSS. The interface uses custom components built on Radix UI primitives and follows an archival "Warm Obsidian and Criterion Spine" design with solid surfaces and zero glassmorphism.

---

## Documentation (Diataxis framework)

Watchlo documentation is organized into four sections based on the Diataxis framework:

- **[Tutorial: Getting Started](docs/tutorials/getting-started.md)**: A step-by-step lesson to install dependencies, configure environment variables, and run your first stream locally.
- **[How-to: Player and AniSkip](docs/how-to/player-and-skiptime.md)**: Practical guides for keyboard shortcuts, sub-second intro/recap skipping, and configuring DNS for ad-free playback.
- **[Reference: API and Services](docs/reference/api-and-services.md)**: Technical specifications for internal route handlers (`app/api/*`), service classes, and environment variables.
- **[Explanation: Architecture and Design](docs/explanation/architecture-and-design.md)**: Design discussions explaining internal proxy routing, CORS isolation, and the solid surface visual language.

---

## Quickstart

### Prerequisites

- Node.js 18.17 or higher
- npm (bundled with Node.js)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/alfaruqii/watchlo.git
cd watchlo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment configuration into `.env.local`:

```bash
cp .env.example .env.local
```

Add your backend endpoints and access credentials:

```env
# Server-only upstream endpoints. Keep confidential.
WATCHLO_API_V0=https://api.yourdomain.com/tmdb
WATCHLO_API_V1=https://api.yourdomain.com/anime/v1
WATCHLO_API_V2=https://api.yourdomain.com/anime/v2
CUSTOM_API_KEY=your_upstream_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key features

- **Unified catalog**: Browse movies, series, and anime with backdrops, trailers, relations, and user reviews.
- **Screening room player**: Custom video layout built on Vidstack and `hls.js` with quality selectors and subtitle controls.
- **AniSkip integration**: Sub-second skip detection for anime opening themes, ending credits, and recaps with timeline chapter markers.
- **Archival design**: High-contrast, tactile interface inspired by Criterion physical releases and Japanese OBI strips. All components use solid backgrounds without CSS backdrop blur filters.
- **Manga shelf**: Integrated manga search and chapter reading powered by `MangaService`.

---

## Technical reference summary

### Internal API proxy routes

All browser requests go through Next.js Route Handlers to isolate API keys and avoid upstream CORS blocks:

| Route | Method | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `/api/animestream` | GET | `query` | Fetches HLS stream URLs and subtitle tracks |
| `/api/anime-infov1` | GET | `query`, `title` | Retrieves episode rosters from streaming providers |
| `/api/anime-infov2` | GET | `query` | Fetches AniList series metadata and relations |
| `/api/anime-skiptime` | GET | `id`, `ep` | Returns opening, ending, and recap intervals |
| `/api/anime-search` | GET | `query` | Searches anime catalog via AniList |
| `/api/manga-search` | GET | `q`, `page`, `size` | Searches manga titles and chapters |
| `/api/movie-search` | GET | `query` | Searches movies and series via TMDB |
| `/api/subtitles` | GET | `id` | Fetches subtitle tracks for cinema embeds |

### Keyboard shortcuts

| Key | Action |
| :--- | :--- |
| `Space` or `K` | Play or pause video |
| `ArrowLeft` or `J` | Seek backward 10 seconds |
| `ArrowRight` or `L` | Seek forward 10 seconds |
| `S` | Skip active opening, ending, or recap interval |
| `C` | Toggle subtitles on or off |
| `I` | Toggle Picture-in-Picture mode |
| `T` | Toggle theater mode |
| `F` | Toggle native fullscreen |
| `M` | Mute or unmute audio |
| `?` | Open keyboard shortcuts modal |

### Available commands

```bash
# Start local development server
npm run dev

# Compile production build
npm run build

# Start production server
npm run start

# Run ESLint validation
npm run lint

# Run Jest unit test suite
npm run test

# Run Jest in watch mode
npm run test:watch
```

---

## Support

What it feels like asking for a star

![Meme](https://res.cloudinary.com/de6icstca/image/upload/v1728121626/watchlo/readme/meme_ie1fqr_c_fill_w_200_xkk7xg.jpg)

![IShowSpeed Trying Not To Laugh](https://media.tenor.com/A13EUCXasVQAAAAM/ishowspeed-speed-trying-to-not-laugh.gif)

---

## Author and credits

- Developed by [@alfaruqi](https://github.com/alfaruqii)
- Data provided by TMDB, AniList, and AniSkip
