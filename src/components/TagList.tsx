import { Award, Clock, Code2, Compass, Sparkles, Users } from "lucide-react";

export function TagList({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  const isDomain = label.toLowerCase().includes("domain");
  const isSkill = label.toLowerCase().includes("skill");

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {isSkill && <Code2 className="h-3.5 w-3.5 text-primary" />}
        {isDomain && <Compass className="h-3.5 w-3.5 text-cyan" />}
        {!isSkill && !isDomain && <Sparkles className="h-3.5 w-3.5 text-amber" />}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className="ml-1 rounded-full bg-secondary/80 px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
          {items.length}
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={item}
            className={`${
              isDomain ? "pill-tag-domain" : "pill-tag"
            } animate-chip-in inline-flex items-center gap-1 px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-md`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MetaField({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;

  const lower = label.toLowerCase();
  let Icon = Sparkles;
  let accentColor = "text-primary";
  let bgAccent = "from-primary/10 to-violet/10";

  if (lower.includes("avail")) {
    Icon = Clock;
    accentColor = "text-cyan";
    bgAccent = "from-cyan/10 to-primary/10";
  } else if (lower.includes("exp")) {
    Icon = Award;
    accentColor = "text-amber";
    bgAccent = "from-amber/10 to-primary/10";
  } else if (lower.includes("team") || lower.includes("size")) {
    Icon = Users;
    accentColor = "text-emerald";
    bgAccent = "from-emerald/10 to-cyan/10";
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br ${bgAccent} p-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40`}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${accentColor}`} />
        <p className="text-[11px] font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1.5 text-sm font-semibold capitalize tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
