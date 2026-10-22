import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    { path: "/api/animestream", method: "GET" },
    { path: "/api/anime-infov1", method: "GET" },
    { path: "/api/anime-infov2", method: "GET" },
    { path: "/api/anime-search", method: "GET" },
    { path: "/api/anime-skiptime", method: "GET" },
    { path: "/api/manga-search", method: "GET" },
    { path: "/api/manga-list", method: "GET" },
    { path: "/api/movie-search", method: "GET" },
  ],
});
