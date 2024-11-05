import { useThemeStore } from "@/store/themeStore";

function SearchedGenre({ genre = "unknown" }: { genre: string }) {
  const { theme } = useThemeStore();
  return (
    <>
      <span
        className={`${
          theme === "garden"
            ? "bg-gray-700 text-gray-100"
            : "bg-gray-400 text-gray-900"
        } flex items-center w-fit rounded-sm p-1 text-center
          text-xs`}
      >
        {genre}
      </span>
    </>
  );
}

export default SearchedGenre;
