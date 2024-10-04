import { useThemeStore } from "@/store/themeStore";
import Link from "next/link";
import DocsIcon from "../icons/DocsIcon";
import AnimeIcon from "../icons/AnimeIcon";
import MoviesIcon from "../icons/MoviesIcon";
import GithubIcon from "../icons/GithubIcon";

function Menu({ isToggled = false }) {
  const { theme } = useThemeStore();

  return (
    <div
      className={`min-h-fit z-50 ${theme === "garden" ? "bg-gray-200/60" : "bg-black/70"} backdrop-blur-lg w-full fixed transition-all animate-delay-75 duration-200 animate-duration-500 animate-once pt-2 pb-5 px-3 ${isToggled ? "top-12 animate-fade-down" : "-top-96"
        }`}
    >
      <Link href="/">
        <div className="p-2 flex gap-1 w-full">
          <MoviesIcon />
          <p>Movies</p>
        </div>
      </Link>
      <Link href="/anime">
        <div className="p-2 flex gap-1">
          <AnimeIcon />
          <p>Anime</p>
        </div>
      </Link>
      <Link href="/docs">
        <div className="p-2 flex gap-1">
          <DocsIcon />
          <p>Docs</p>
        </div>
      </Link>
      <Link href="https://github.com/alfaruqii/watchlo" target="_blank">
        <div className="p-2 flex gap-1">
          <GithubIcon />
          <p>Github</p>
        </div>
      </Link>
    </div>
  );
}

export default Menu;

