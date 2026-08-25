import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Loader2,
  Sparkles,
  FolderPlus,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Zap,
  Users,
} from "lucide-react";

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

const SAMPLES = [
  {
    topic: "Carbon Dashboard",
    text: "We're building an app that turns utility bills into a household carbon dashboard. I handle backend and data pipelines. We need someone strong on mobile UI plus anyone who has worked with OCR or document parsing. Aiming for a team of four for a 48-hour hackathon.",
  },
  {
    topic: "AI Code Reviewer",
    text: "Building an autonomous GitHub code reviewer using LLMs and AST analysis. Looking for a Python/Rust systems developer and a frontend engineer skilled in React and VS Code extensions. Target squad size: 3.",
  },
  {
    topic: "HealthTech Journal",
    text: "Creating an AI audio symptom journal for doctors and patients. I build the speech pipelines with Whisper. Need a React Native mobile dev and someone with HIPAA data privacy experience. Team size: 4.",
  },
];

const PLACEHOLDER = SAMPLES[0].text;

function PostProjectPage() {
  const [text, setText] = useState("");
  const run = useServerFn(extractProject);
  const mutation = useMutation({
    mutationFn: (value: string) => run({ data: { text: value } }),
  });

  const project = mutation.data;
  const charCount = text.trim().length;
  const isValidLength = charCount >= 10;

  return (
    <PageShell
      title="Post a project"
      subtitle="Describe what you're building and the kind of teammates you're missing. AI turns it into a structured brief."
    >
      <form
        className="surface-card relative overflow-hidden p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (isValidLength) mutation.mutate(text.trim());
        }}
      >
        {/* Form Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet/10 text-violet">
              <FolderPlus className="h-4 w-4" />
            </div>
            <div>
              <label htmlFor="project-text" className="text-sm font-bold text-foreground">
                Project Vision & Teammates Needed
              </label>
              <p className="text-[11px] text-muted-foreground">Explain the product concept, tech stack gaps, and target squad size</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-violet/20 bg-violet/5 px-2.5 py-0.5 text-[11px] font-medium text-violet">
            <Zap className="h-3 w-3" />
            <span>AI Brief Extractor</span>
          </span>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-amber" />
            <span className="font-medium">Quick Project Starters:</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <button
                key={sample.topic}
                type="button"
                onClick={() => setText(sample.text)}
                className="group flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground transition-all duration-200 hover:border-violet/50 hover:bg-violet/10 hover:text-foreground active:scale-95"
              >
                <Sparkles className="h-3 w-3 text-violet/70 transition-transform group-hover:rotate-12" />
                <span>{sample.topic}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mt-4">
          <Textarea
            id="project-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={8}
            className="w-full resize-y rounded-2xl border-border/80 bg-background/60 p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:border-violet focus-visible:ring-1 focus-visible:ring-violet"
          />
        </div>

        {/* Footer actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  isValidLength ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500"
                }`}
              />
              <span className="font-mono text-muted-foreground">
                {charCount} chars {isValidLength ? "(ready)" : "(min 10 required)"}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending || !isValidLength}
            className="relative overflow-hidden bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/40 disabled:opacity-50"
          >
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

      {/* Loading Indicator */}
      {mutation.isPending && (
        <LoadingDots message="Extracting needed skills, domains and team size…" />
      )}

      {/* Error Message */}
      {mutation.isError && (
        <p className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
          {(mutation.error as Error).message}
        </p>
      )}

      {/* Result Card */}
      {project && !mutation.isPending && (
        <div className="surface-card animate-fade-up relative mt-8 overflow-hidden p-7 sm:p-8">
          {/* Result Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet to-primary text-lg font-bold text-primary-foreground shadow-md shadow-violet/30">
                <FolderPlus className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">{project.title ?? "Untitled project"}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Project Saved</span>
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">Project ID: {project.id?.slice(0, 8) ?? "Live"}</p>
              </div>
            </div>

            <Link
              to="/find-team"
              className="group inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet/15 px-4 py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-violet hover:text-white hover:shadow-lg hover:shadow-violet/25"
            >
              <Users className="h-3.5 w-3.5 text-violet group-hover:text-white" />
              <span>Find teammates for this project</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Structured Brief Fields */}
          <div className="mt-6 grid gap-6">
            <TagList label="Needed skills" items={project.needed_skills ?? []} />
            <TagList label="Project Domains" items={project.domains ?? []} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetaField label="Target Team Size" value={`${project.team_size} members`} />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
