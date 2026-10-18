function Question({
  text = "",
  customClass = "",
}: {
  text: string;
  customClass?: string;
}) {
  return (
    <h2
      className={`${customClass} text-balance font-display text-lg font-bold tracking-tight text-foreground sm:text-2xl`}
    >
      {text}
    </h2>
  );
}

export default Question;
