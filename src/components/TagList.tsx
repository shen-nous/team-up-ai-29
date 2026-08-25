export function TagList({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={item}
            className="pill-tag animate-chip-in px-3 py-1 text-xs font-medium transition-transform duration-200 hover:scale-105"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MetaField({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-foreground">{value}</p>
    </div>
  );
}
