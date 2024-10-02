function Answer({ text = "", customClass }: { text: string; customClass?: string }) {
  return (
    <>
      <p className={`${customClass} text-balance`}>{text}</p>
    </>
  )
}

export default Answer;
