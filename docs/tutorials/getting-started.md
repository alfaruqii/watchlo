# Tutorial: Getting Started with Watchlo

This tutorial guides you through setting up and running Watchlo on your local development machine. By the end of this guide, you will have a running local instance connected to the media APIs, capable of streaming movies, television series, and anime.

## Learning objectives

In this tutorial, you will:
1. Clone the project repository and install its dependencies.
2. Configure the required environment variables for upstream API services.
3. Start the Next.js development server.
4. Verify movie discovery, anime streaming, and AniSkip playback in your browser.

## Prerequisites

Before you begin, ensure you have:
- Node.js version 18.17 or later installed on your system.
- npm (bundled with Node.js) or a compatible package manager.
- Git installed on your system.
- An internet connection to reach TMDB and AniList gateway endpoints.

---

## Step 1: Clone the repository

Open your terminal, navigate to the directory where you keep your development projects, and clone the repository:

```bash
git clone https://github.com/alfaruqii/watchlo.git
cd watchlo
```

Inspect the folder structure. The project is a standard Next.js 15 App Router application with code organized under the `app` directory.

---

## Step 2: Install project dependencies

Install the required npm packages:

```bash
npm install
```

This installs core libraries including:
- Next.js 15 and React 19
- Tailwind CSS with custom hairline and warm obsidian color definitions
- Radix UI primitives for dialogs, dropdowns, and accessibility
- Zustand for lightweight state management (theme and episode selections)
- SWR for data fetching and caching
- Vidstack player with `hls.js` for video streaming

---

## Step 3: Configure environment variables

Watchlo requires access keys and base URLs for upstream media services. Create a local environment file in the project root:

```bash
cp .env.example .env.local
```

If `.env.example` is not present, create `.env.local` manually with these entries:

```env
# Upstream Service Gateways (Server-only, kept confidential)
WATCHLO_API_V0=https://api.yourdomain.com/tmdb
WATCHLO_API_V1=https://api.yourdomain.com/anime/v1
WATCHLO_API_V2=https://api.yourdomain.com/anime/v2

# Upstream Authentication Key (Server-only, never prefix with NEXT_PUBLIC_)
CUSTOM_API_KEY=your_upstream_api_key_here

# Optional: Internal Anti-Leech Signature Secret
INTERNAL_API_SECRET=your_random_internal_secret_here
```

Replace `your_upstream_api_key_here` with your access token. Upstream API keys and endpoints are kept strictly on the server and must never use the `NEXT_PUBLIC_` prefix to prevent them from leaking into client JavaScript bundles.

---

## Step 4: Start the development server

Launch the Next.js development server:

```bash
npm run dev
```

The terminal will report that the local server is listening on port 3000:

```text
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Environments: .env.local
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Step 5: Verify your setup

Confirm that the application works by testing the three primary media categories:

1. **Movies and TV series**:
   On the home page (`/`), you should see featured hero banners, trending titles, and top-rated cards populated from TMDB via `API_V0`. Click any title to open its detail page (`/movie/detail/[id]`).
2. **Anime catalog**:
   Click "Anime" in the navigation bar to visit `/anime`. The catalog displays currently airing series and popular releases from AniList via `API_V2`.
3. **Screening room and AniSkip**:
   Open an anime title (for example, *One Piece* or *Jujutsu Kaisen*) and click "Watch Episode 1".
   - The Vidstack video player should load the HLS stream.
   - During the intro sequence, look for the "Skip Intro" button in the bottom right of the viewfinder.
   - Press `S` or click the button to verify that playback advances directly past the opening sequence.

---

## Next steps

Now that your local instance is running:
- Read [How to configure player controls and AniSkip](../how-to/player-and-skiptime.md) to learn how chapter markers and keyboard controls work.
- Consult the [API and services reference](../reference/api-and-services.md) for endpoint specifications and data models.
- Read [Architecture and design philosophy](../explanation/architecture-and-design.md) to understand why Watchlo uses server-side proxy routes and solid surfaces.
