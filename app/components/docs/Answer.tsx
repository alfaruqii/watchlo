function Answer({
  text = "",
  customClass = "",
}: {
  text: string;
  customClass?: string;
}) {
  return (
    <p
      className={`${customClass} mt-2 max-w-[68ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base`}
    >
      {text}
    </p>
  );
}

export default Answer;
