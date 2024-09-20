type Genre = {
  genre: string;
}

function Genre({ genre }: Genre) {
  return (
    <span
      className="rounded border border-gray-400 bg-gray-800 p-2 text-xs sm:text-base"
    >
      {genre}
    </span>
  )
}

export default Genre
