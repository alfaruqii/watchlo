type Genre = {
  genre: string;
}

function Genre({ genre }: Genre) {
  return (
    <span
      className="rounded border border-gray-400/60 bg-gray-800/50 p-2 text-xs font-black drop-shadow backdrop-blur-md sm:text-base"
    >
      {genre}
    </span>
  )
}

export default Genre
