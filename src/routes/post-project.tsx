import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { LoadingDots, PageShell } from "@/components/AppNav";
import { MetaField, TagList } from "@/components/TagList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractProject } from "@/lib/match.functions";

export const Route = createFileRoute("/post-project")({
  head: () => ({
    meta: [
      { title: "Post a Project — Project Match" },
      {
        name: "description",
        content:
          "Describe your hackathon project and the teammates you need. Project Match extracts the needed skills, domains and team size.",
      },
      { property: "og:title", content: "Post a Project — Project Match" },
      {
        property: "og:description",
        content: "Describe your project in free text and get a structured brief of the teammates you need.",
      },
    ],
  }),
  component: PostProjectPage,
});

const PLACEHOLDER =
  "We're building an app that turns utility bills into a household carbon dashboard. I handle backend and data pipelines. We need someone strong on mobile UI plus anyone who has worked with OCR or document parsing. Aiming for a team of four for a 48-hour hackathon.";

function PostProjectPage() {
  const [text, setText] = useState("");
  const run = useServerFn(extractProject);
  const mutation = useMutation({
    mutationFn: (value: string) => run({ data: { text: value } }),
  });

  const project = mutation.data;

  return (
    <PageShell
      title="Post a project"
      subtitle="Describe what you're building and the kind of teammates you're missing. AI turns it into a structured brief."
    >
      <form
        className="surface-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim().length >= 10) mutation.mutate(text.trim());
        }}
      >
        <label htmlFor="project-text" className="text-sm font-medium">
          Describe your project and who you need
        </label>
        <Textarea
          id="project-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={9}
          className="mt-3 resize-y bg-background/60 text-sm leading-relaxed"
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{text.trim().length} characters</p>
          <Button type="submit" disabled={mutation.isPending || text.trim().length < 10}>
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Parsing project…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Parse & save project
              </>
            )}
          </Button>
        </div>
      </form>

      {mutation.isPending && (
        <LoadingDots message="Extracting needed skills, domains and team size…" />
      )}

      {mutation.isError && (
        <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {(mutation.error as Error).message}
        </p>
      )}

      {project && !mutation.isPending && (
        <div className="surface-card animate-fade-up mt-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{project.title ?? "Untitled project"}</h2>
            <span className="pill-tag px-3 py-1 text-xs font-semibold">Saved</span>
          </div>
          <div className="mt-5 grid gap-5">
            <TagList label="Needed skills" items={project.needed_skills ?? []} />
            <TagList label="Domains" items={project.domains ?? []} />
            <MetaField label="Team size" value={project.team_size} />
          </div>
        </div>
      )}
    </PageShell>
  );
}
