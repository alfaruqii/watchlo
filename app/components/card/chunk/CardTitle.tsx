function CardTitle({ title }: { title: string }) {
  return (
    <>
      <div className="w-32 sm:w-52">
        <p className="line-clamp-2 text-sm font-bold">{title}</p>
      </div>
    </>
  )
}

export default CardTitle
