import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  UserPlus,
  FolderPlus,
  Users,
  Zap,
  CheckCircle2,
  Cpu,
  Target,
  Layers,
} from "lucide-react";
import React from "react";

const links = [
  { to: "/", label: "Add Profile", icon: UserPlus },
  { to: "/post-project", label: "Post a Project", icon: FolderPlus },
  { to: "/find-team", label: "Find a Team", icon: Users },
] as const;

export function AppNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      {/* Ambient Top Glow Beam */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]">
          <div className="gradient-surface relative grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-primary-foreground shadow-[0_0_20px_-4px_oklch(0.64_0.21_262_/_0.8)] transition-all duration-300 group-hover:shadow-[0_0_28px_-2px_oklch(0.64_0.21_262_/_0.9)]">
            <span className="font-display text-base font-extrabold">P</span>
            <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                Project Match
              </span>
              <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-block">
                AI Matcher
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">Hackathon Team Builder</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex flex-wrap items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 p-1 backdrop-blur-md">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/80 hover:text-foreground"
                  activeProps={{
                    className:
                      "bg-accent text-foreground shadow-[0_2px_12px_-3px_oklch(0.64_0.21_262_/_0.4),inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_50%,transparent)] font-semibold",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Multi-layered Ambient Background Decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Glow Blobs */}
        <div className="bg-blob -left-20 top-[-8rem] h-[30rem] w-[30rem] bg-primary/20" />
        <div
          className="bg-blob right-[-10rem] top-12 h-[28rem] w-[28rem] bg-violet/20"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="bg-blob left-1/3 bottom-[-10rem] h-[24rem] w-[24rem] bg-cyan/15"
          style={{ animationDelay: "-11s" }}
        />

        {/* Ambient Grid & Dots */}
        <div className="bg-dots absolute inset-x-0 top-0 h-[48rem] opacity-70" />
        <div className="bg-grid absolute inset-x-0 top-0 h-[36rem] opacity-40" />

        {/* Floating Decorative Tech Pills (Ambient Corners) */}
        <div className="hidden lg:block">
          <div className="animate-float absolute left-8 top-36 flex items-center gap-1.5 rounded-full border border-primary/20 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md opacity-75">
            <Zap className="h-3 w-3 text-primary" />
            <span>AI NLP Extraction</span>
          </div>
          <div
            className="animate-float absolute right-10 top-48 flex items-center gap-1.5 rounded-full border border-violet/20 bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-md opacity-75"
            style={{ animationDelay: "-3s" }}
          >
            <Target className="h-3 w-3 text-violet" />
            <span>Skill Gap Reasoning</span>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col">
        <AppNav />

        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          {/* Enhanced Hero Banner */}
          <div className="hero-glow animate-fade-up relative -mx-2 mb-10 overflow-hidden rounded-3xl p-7 sm:-mx-6 sm:p-9">
            {/* Top decorative badge */}
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI TEAMMATE MATCHING</span>
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="text-[10px] uppercase tracking-wider text-primary/80">Active</span>
            </div>

            <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>

            {/* Micro Feature Highlight Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/40 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                <span>Instant Structure Extraction</span>
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan" />
                <span>Deep Skill Taxonomy</span>
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-violet" />
                <span>Gap-Based Fit Scores</span>
              </span>
            </div>
          </div>

          {children}
        </main>

        {/* Polished Glassmorphic Footer */}
        <footer className="mt-16 border-t border-border/60 bg-background/60 py-8 backdrop-blur-lg">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-foreground">Project Match Engine</span>
              <span className="text-muted-foreground/60">•</span>
              <span>Intelligent Hackathon Team Formation</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <span className="rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 font-mono">
                ⚡ Realtime AI Match
              </span>
              <span className="rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 font-mono">
                🔒 Privacy First
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function LoadingDots({ message }: { message: string }) {
  return (
    <div className="surface-card shimmer mt-6 flex items-center gap-3.5 p-6 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="gradient-surface dot-pulse h-2.5 w-2.5 rounded-full shadow-[0_0_8px_var(--primary)]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </span>
      <span className="font-medium text-foreground/90">{message}</span>
    </div>
  );
}
