# How-to Guide: Video Player Controls, AniSkip, and Ad Filtering

This guide explains how to use the Watchlo media player, navigate anime episodes using AniSkip timestamp markers, and configure your local browser to prevent intrusive ads from third-party streaming providers.

---

## How to use keyboard shortcuts

The screening room player (`app/components/media/Media.tsx`) supports standard cinema hotkeys for one-hand playback control.

| Action | Shortcut | Notes |
| :--- | :--- | :--- |
| Play / Pause | `Space` or `K` | Toggles video playback |
| Seek backward 10s | `ArrowLeft` or `J` | Triggers rewind flash notice |
| Seek forward 10s | `ArrowRight` or `L` | Triggers fast-forward flash notice |
| Skip opening / ending / recap | `S` | Seeks to the end of the active segment |
| Toggle subtitles | `C` | Cycles between available tracks and "off" |
| Toggle Picture-in-Picture | `I` | Floats player window outside the browser |
| Toggle theater mode | `T` | Expands viewport to full container width |
| Toggle fullscreen | `F` | Opens native browser fullscreen |
| Volume / Mute | `M` | Mutes or restores audio |
| Open shortcuts list | `?` | Displays on-screen keybindings modal |

Keypresses are automatically ignored when typing in search inputs or dialog forms.

---

## How AniSkip timestamp skipping works

Anime episodes frequently contain recap sequences, opening themes (OP), and ending credits (ED). Watchlo integrates with the AniSkip database to detect these segments automatically with sub-second precision.

### Segment detection

When you open an episode at `/anime/watch?id={animeId}&ep={epNum}`, the player requests interval metadata from `/api/anime-skiptime?id={animeId}&ep={epNum}`:

```json
{
  "found": true,
  "results": {
    "op": { "interval": { "startTime": 28.78, "endTime": 118.78 } },
    "ed": { "interval": { "startTime": 1388.0, "endTime": 1500.0 } },
    "recap": { "interval": { "startTime": 132.77, "endTime": 201.3 } }
  }
}
```

### Visual prompts and actions

1. **Floating viewfinder button**:
   When the playback cursor enters an opening, ending, or recap interval, a gold button appears in the bottom right corner of the video. The button displays the target timestamp, such as `Skip Intro (01:58)`.
2. **Keyboard trigger**:
   Pressing `S` while within any active window instantly seeks the player to `endTime` and shows a brief confirmation pill.
3. **Seekbar chapter markers**:
   The player converts timestamps into a WebVTT track loaded into `<Track kind="chapters" />`. Vidstack marks these segments directly on the timeline scrubber.

### Fallback behavior

If an episode does not have timestamp data in the AniSkip database, the API proxy returns `{ "found": false }`. The player falls back to standard playback controls. Clicking the deck skip button in fallback mode advances playback by 85 seconds.

---

## How to resolve subtitle errors with OpenDNS

Some internet service providers apply domestic content filters that block third-party subtitle delivery networks. If subtitles fail to appear or return network errors:

1. Open your browser settings and navigate to **Privacy and security** > **Security**.
2. Enable **Use secure DNS**.
3. Select **Cloudflare (1.1.1.1)** or **Google (Public DNS 8.8.8.8)**.
4. Refresh the Watchlo playback page. Subtitle `.vtt` tracks will now download normally.

---

## How to block ads on third-party embeds

Watchlo does not host advertisements, but upstream video providers and embed mirrors (such as VidSrc) may inject popups or banners into their iframes.

To ensure an ad-free screening experience:

1. **Use an ad-blocking extension**:
   Install **uBlock Origin** on Chrome, Firefox, Edge, or Opera. uBlock Origin blocks tracking scripts and popup redirect triggers automatically.
2. **Use an ad-blocking browser**:
   On mobile devices (Android or iOS) where browser extensions may be limited, use **Brave Browser**. Enable **Shields** in aggressive mode to block popups before they spawn new tabs.
