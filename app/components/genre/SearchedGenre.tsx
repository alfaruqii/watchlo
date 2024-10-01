function SearchedGenre({ genre = "unknown", theme = "garden" }: { genre: string, theme: string }) {
  return (
    <>
      <span
        className={`text-xs rounded-sm p-1 ${theme === "garden" ? "bg-gray-700 text-gray-100" : "bg-gray-400 text-gray-900"
          }`}
      >
        {genre}
      </span>
    </>
  )
}

export default SearchedGenre
