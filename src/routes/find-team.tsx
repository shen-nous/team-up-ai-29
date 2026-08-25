import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Loader2,
  Users,
  Trophy,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Brain,
  Quote,
} from "lucide-react";

import { PageShell } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { listProjects, matchTeam } from "@/lib/match.functions";

export const Route = createFileRoute("/find-team")({
  head: () => ({
    meta: [
      { title: "Find a Team — Project Match" },
      {
        name: "description",
        content:
          "Pick a saved project and let AI rank every candidate, explaining which skill gap each person fills on your team.",
      },
      { property: "og:title", content: "Find a Team — Project Match" },
      {
        property: "og:description",
        content: "AI-ranked teammate matches with reasoning about the exact skill gap each candidate fills.",
      },
    ],
  }),
  component: FindTeamPage,
});

function FindTeamPage() {
  const [projectId, setProjectId] = useState("");
  const fetchProjects = useServerFn(listProjects);
  const runMatch = useServerFn(matchTeam);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });

  const mutation = useMutation({
    mutationFn: (id: string) => runMatch({ data: { projectId: id } }),
  });

  const matches = mutation.data?.matches ?? [];
  const projects = projectsQuery.data ?? [];
  const selectedProject = projects.find((p) => p.id === projectId);

  return (
    <PageShell
      title="Find a team"
      subtitle="Pick a project and AI ranks every saved profile, explaining which gap each candidate fills."
    >
      {/* Project Selector Surface Card */}
      <div className="surface-card relative overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/10 text-cyan">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <label htmlFor="project-select" className="text-sm font-bold text-foreground">
                Target Project
              </label>
              <p className="text-[11px] text-muted-foreground">Select which project needs candidate matching</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-0.5 text-[11px] font-medium text-cyan">
            <Users className="h-3 w-3" />
            <span>{projects.length} Saved {projects.length === 1 ? "Project" : "Projects"}</span>
          </span>
        </div>

        <div className="mt-4">
          <select
            id="project-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-1 w-full cursor-pointer rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">
              {projectsQuery.isLoading ? "Loading projects…" : "Select a saved project..."}
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title ?? project.raw_text.slice(0, 60)}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-3.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Project Brief Summary:</span>
            </div>
            <p className="mt-1 line-clamp-2 leading-relaxed">{selectedProject.raw_text}</p>
          </div>
        )}

        {!projectsQuery.isLoading && projects.length === 0 && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-amber/30 bg-amber/5 p-3.5 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber" />
              <span>No projects available yet. Post a project first.</span>
            </div>
            <Link
              to="/post-project"
              className="inline-flex items-center gap-1 rounded-lg bg-amber/20 px-2.5 py-1 font-semibold text-amber transition-colors hover:bg-amber/30"
            >
              <span>Post Project</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <div className="mt-5 flex justify-end border-t border-border/50 pt-4">
          <Button
            disabled={!projectId || mutation.isPending}
            onClick={() => mutation.mutate(projectId)}
            className="relative overflow-hidden bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/40 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing candidates…
              </>
            ) : (
              <>
                <Users className="h-4 w-4" /> Run AI Matchmaker
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {mutation.isPending && (
        <div className="mt-8 grid gap-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary animate-pulse">
            <Brain className="h-4 w-4 animate-spin" />
            <span>Reasoning about candidate fit and skill complementarity...</span>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card shimmer p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded-lg bg-muted/60" />
                  <div className="h-6 w-44 rounded-lg bg-muted/80" />
                </div>
                <div className="h-10 w-16 rounded-xl bg-muted/70" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3.5 w-full rounded-md bg-muted/50" />
                <div className="h-3.5 w-3/4 rounded-md bg-muted/50" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-muted/40" />
                <div className="h-6 w-20 rounded-full bg-muted/40" />
                <div className="h-6 w-14 rounded-full bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {mutation.isError && (
        <p className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
          {(mutation.error as Error).message}
        </p>
      )}

      {/* Empty State */}
      {mutation.isSuccess && !mutation.isPending && matches.length === 0 && (
        <div className="surface-card mt-8 p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-bold text-foreground">No candidate profiles found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a few profiles first so the AI matchmaker has candidates to evaluate.
          </p>
          <div className="mt-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
            >
              <span>Add Candidate Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Ranked Candidate Results */}
      {matches.length > 0 && !mutation.isPending && (
        <div className="mt-10 grid gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Ranked Candidates ({matches.length})
              </h2>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              AI Gap Analysis Complete
            </span>
          </div>

          {matches.map((match, index) => {
            const isRank1 = index === 0;
            const isRank2 = index === 1;
            const isRank3 = index === 2;

            let rankBadge = (
              <span className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
                #{index + 1}
              </span>
            );
            let cardBorder = "border-border/70";

            if (isRank1) {
              rankBadge = (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber/40 bg-amber/15 px-2.5 py-0.5 text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                  <Trophy className="h-3 w-3 text-amber" />
                  <span>#1 Best Fit</span>
                </span>
              );
              cardBorder = "border-primary/40 shadow-[0_4px_24px_-8px_oklch(0.64_0.21_262_/_0.3)]";
            } else if (isRank2) {
              rankBadge = (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/15 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                  <span>🥈 #2 Match</span>
                </span>
              );
            } else if (isRank3) {
              rankBadge = (
                <span className="inline-flex items-center gap-1 rounded-full border border-violet/40 bg-violet/15 px-2.5 py-0.5 text-xs font-bold text-violet-300">
                  <span>🥉 #3 Match</span>
                </span>
              );
            }

            return (
              <article
                key={match.profile_id}
                className={`surface-card animate-fade-up relative overflow-hidden p-6 sm:p-7 ${cardBorder}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Top Row: Candidate Identity and Match Score */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="gradient-surface grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-base font-bold text-primary-foreground shadow-md shadow-primary/25">
                      {match.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">{match.name}</h3>
                        {rankBadge}
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        ID: {match.profile_id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  {/* Glowing Score Tile */}
                  <div className="flex flex-col items-end rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-violet/10 px-4 py-2 text-right backdrop-blur-sm">
                    <div className="flex items-baseline gap-0.5">
                      <span className="gradient-text font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                        <CountUp value={match.score} />
                      </span>
                      <span className="text-xs font-bold text-primary/70">%</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Match Fit
                    </span>
                  </div>
                </div>

                {/* AI Reasoning Callout Box */}
                <div className="mt-4 rounded-xl border border-border/80 bg-secondary/40 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                    <Quote className="h-3 w-3" />
                    <span>Skill Gap Alignment & Analysis</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">{match.reasoning}</p>
                </div>

                {/* Skills Chips */}
                {match.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                      Skills:
                    </span>
                    {match.skills.slice(0, 8).map((skill, si) => (
                      <span
                        key={skill}
                        className="pill-tag animate-chip-in inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-transform duration-200 hover:scale-105"
                        style={{ animationDelay: `${index * 80 + 150 + si * 40}ms` }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const total = 28;
    const id = window.setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / total, 3);
      setDisplay(Math.round(value * eased));
      if (frame >= total) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [value]);

  return <>{display}</>;
}
