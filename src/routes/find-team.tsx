import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";

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

  return (
    <PageShell
      title="Find a team"
      subtitle="Pick a project and AI ranks every saved profile, explaining which gap each candidate fills."
    >
      <div className="surface-card p-6">
        <label htmlFor="project-select" className="text-sm font-medium">
          Project
        </label>
        <select
          id="project-select"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="mt-3 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        >
          <option value="">
            {projectsQuery.isLoading ? "Loading projects…" : "Select a saved project"}
          </option>
          {(projectsQuery.data ?? []).map((project) => (
            <option key={project.id} value={project.id}>
              {project.title ?? project.raw_text.slice(0, 60)}
            </option>
          ))}
        </select>

        {!projectsQuery.isLoading && (projectsQuery.data ?? []).length === 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            No projects yet — post one first, then come back here.
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <Button disabled={!projectId || mutation.isPending} onClick={() => mutation.mutate(projectId)}>
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Ranking candidates…
              </>
            ) : (
              <>
                <Users className="h-4 w-4" /> Find matches
              </>
            )}
          </Button>
        </div>
      </div>

      {mutation.isPending && (
        <div className="mt-6 grid gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card shimmer p-6">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-3 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground">
            Reasoning about each candidate's fit — this takes a few seconds.
          </p>
        </div>
      )}

      {mutation.isError && (
        <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {(mutation.error as Error).message}
        </p>
      )}

      {mutation.isSuccess && !mutation.isPending && matches.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No profiles saved yet — add a few profiles first.
        </p>
      )}

      {matches.length > 0 && !mutation.isPending && (
        <div className="mt-8 grid gap-4">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            Ranked candidates ({matches.length})
          </h2>
          {matches.map((match, index) => (
            <article
              key={match.profile_id}
              className="surface-card animate-fade-up p-6"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">#{index + 1}</p>
                  <h3 className="text-lg font-bold">{match.name}</h3>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{match.profile_id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="gradient-text text-3xl font-bold">
                    <CountUp value={match.score} />
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">score</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">{match.reasoning}</p>
              {match.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {match.skills.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="pill-tag animate-chip-in px-2.5 py-1 text-[11px] font-medium"
                      style={{ animationDelay: `${index * 90 + 200}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const total = 32;
    const id = window.setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / total, 3);
      setDisplay(Math.round(value * eased));
      if (frame >= total) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [value]);

  return <>{display}</>;
}
