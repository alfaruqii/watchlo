# Explanation: Architecture Decisions and Design System

This document explains the technical reasons behind Watchlo's architecture, including its internal proxy handlers, multi-provider anime integration, and its deliberate shift away from glassmorphism toward solid archival surfaces.

---

## Architectural decisions

### Why client components do not call upstream services directly

In standard single-page applications, frontend components often fetch data directly from third-party APIs. Watchlo routes every client query through Next.js Route Handlers (`app/api/*`).

Three factors motivated this approach:

1. **Upstream CORS restrictions**: Media scrapers and streaming hosts generally enforce strict Cross-Origin Resource Sharing rules that block requests coming directly from browser origins. Next.js Route Handlers execute in a Node.js server runtime where browser CORS policies do not apply.
2. **Credential containment**: Accessing upstream endpoints requires a shared authorization token (`CUSTOM_API_KEY`). Exposing this key in client-side bundles allows anyone inspecting the network panel to use it outside the application. Route handlers attach the key on the server side, keeping it hidden from the browser.
3. **Upstream error normalization**: Third-party anime providers often return HTTP 404 or 500 when an episode has no timestamp markers or mirror streams. If a browser SWR hook receives a 404, it registers an uncaught error state and halts rendering. Internal route handlers catch upstream 404 responses and return a sanitized payload, such as `{ found: false, results: null }` with a 200 status code, allowing the video player to fall back smoothly.

### Dual-service anime catalog and playback model

Watchlo splits anime operations between two different backends:

- **Metadata and cataloging (`API_V2`)**: AniList supplies cover images, English/Romaji titles, season relations, and episode counts. AniList data is clean, well-formatted, and accurate.
- **Streaming links and video files (`API_V1`)**: Video scrapers extract direct HLS (.m3u8) streams, multi-resolution playlists, and subtitle files from video delivery hosts.

By pairing AniList catalog entries with automated provider resolvers, Watchlo combines accurate archival metadata with functioning playback sources.

---

## Design system philosophy

### Why Watchlo avoids glassmorphism

Many streaming portals and web applications use glassmorphism: semi-transparent cards, heavy CSS `backdrop-filter: blur()`, and bright gradient glows.

Watchlo deliberately avoids this pattern for two reasons:

1. **Legibility and contrast**: Translucent cards placed over rotating backdrops create uneven contrast. Subtitles, episode numbers, and synopsis text become difficult to read depending on the underlying image. Solid surfaces (`bg-[#0d0c0a]`, `bg-surface-1`, `bg-surface-2`) provide predictable contrast in both dark and light modes.
2. **GPU and rendering efficiency**: CSS backdrop filters force browsers to repaint composited layers during scrolling and video playback. On low-power laptops, tablets, and budget mobile phones, stacked blur layers cause dropped frames. Solid backgrounds render quickly without taxing mobile GPUs.

### The Criterion Spine and archival OBI aesthetic

Watchlo takes design inspiration from physical film archives, repertory theater programs, and Criterion collection physical releases.

- **Monospace catalogue labeling**: Episode badges, format chips, and date stamps use `Azeret Mono`. Catalog identifiers appear in the format `CAT // #21`, referencing physical reel numbers.
- **Warm obsidian and projector amber palette**: Deep neutral blacks (`#0d0c0a`) represent the darkness of a cinema booth, while warm amber (`#e09f3e`) and vermilion (`#c84b31`) evoke projector bulbs and archival catalog stamps.
- **Hairline borders and tactile cards**: Components use 1-pixel borders (`#2b2620`) and sharp corner radii (2px to 4px) to create the impression of printed paper dossiers rather than digital app tiles.
- **Screening room HUD**: Video controls, quality selectors, and subtitle pickers are housed in a solid "Screening Deck" docked beneath the video frame, avoiding overlapping controls that obscure cinema framing.
