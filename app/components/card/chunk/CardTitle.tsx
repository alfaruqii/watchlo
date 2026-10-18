function CardTitle({ title }: { title: string }) {
  return (
    <div className="w-full">
      <p
        className="line-clamp-1 font-display text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-gold"
        title={title}
      >
        {title}
      </p>
    </div>
  );
}

export default CardTitle;
