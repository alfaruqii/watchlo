function Question({ text = "", customClass }: { text: string; customClass?: string }) {
  return (
    <>
      <p className={`${customClass} text-pretty font-magnatbold text-xl sm:text-3xl`}>{text}</p>
    </>
  )
}

export default Question;
