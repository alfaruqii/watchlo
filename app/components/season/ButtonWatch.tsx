function ButtonWatch({ text }: { text: string }) {
  return (
    <>
      <button type="button" className="btn btn-sm w-fit rounded bg-gray-400 border-none font-bold text-gray-800 md:text-lg">{text}</button>
    </>
  )
}

export default ButtonWatch
