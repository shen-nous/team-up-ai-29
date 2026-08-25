import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Add Profile" },
  { to: "/post-project", label: "Post a Project" },
  { to: "/find-team", label: "Find a Team" },
] as const;

export function AppNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-surface grid h-8 w-8 place-items-center rounded-xl text-sm font-bold text-primary-foreground shadow-[0_8px_24px_-10px_var(--primary)]">
            P
          </span>
          <span className="font-display text-base font-bold tracking-tight">Project Match</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-full px-3.5 py-1.5 text-muted-foreground transition-all duration-300 hover:bg-accent/70 hover:text-foreground"
              activeProps={{
                className:
                  "bg-accent text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_40%,transparent)]",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-blob -left-24 top-[-10rem] h-[26rem] w-[26rem] bg-primary/25" />
        <div
          className="bg-blob right-[-8rem] top-10 h-[24rem] w-[24rem] bg-violet/25"
          style={{ animationDelay: "-6s" }}
        />
        <div className="bg-dots absolute inset-x-0 top-0 h-[38rem] opacity-60" />
      </div>

      <div className="relative">
        <AppNav />
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="hero-glow animate-fade-up -mx-2 mb-10 rounded-3xl px-6 py-9 sm:-mx-6">
            <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function LoadingDots({ message }: { message: string }) {
  return (
    <div className="surface-card shimmer mt-6 flex items-center gap-3 p-6 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="gradient-surface dot-pulse h-2 w-2 rounded-full"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </span>
      {message}
    </div>
  );
}
