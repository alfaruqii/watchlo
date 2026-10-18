type InfosProps = {
  topic: string;
  value?: string | number;
  customTheme?: string;
};

function Infos({ topic, value, customTheme }: InfosProps) {
  return (
    <div className="flex w-full items-baseline justify-between gap-3 border-b border-hairline/60 py-2 last:border-b-0">
      <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {topic}
      </span>
      <span
        className={`${
          customTheme ?? "text-foreground"
        } min-w-0 max-w-[65%] truncate text-right font-mono text-xs font-medium capitalize tabular-nums sm:max-w-full`}
      >
        {value ?? "unknown"}
      </span>
    </div>
  );
}

export default Infos;
