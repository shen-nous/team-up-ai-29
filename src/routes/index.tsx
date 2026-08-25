import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Loader2,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  FileText,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { LoadingDots, PageShell } from "@/components/AppNav";
import { MetaField, TagList } from "@/components/TagList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractProfile } from "@/lib/match.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Add Your Profile — Project Match" },
      {
        name: "description",
        content:
          "Describe yourself in plain English and Project Match turns it into a structured teammate profile for hackathons and side projects.",
      },
      { property: "og:title", content: "Add Your Profile — Project Match" },
      {
        property: "og:description",
        content: "Turn a free-text intro into a structured teammate profile for hackathon team formation.",
      },
    ],
  }),
  component: AddProfilePage,
});

const SAMPLES = [
  {
    role: "Frontend & ML",
    text: "I'm Maya, a frontend dev comfortable with React, TypeScript and Tailwind. I've shipped two ML side projects and I'm into climate tech and developer tools. I can do about 15 hours a week, mostly evenings. Been coding professionally for 3 years.",
  },
  {
    role: "Full-Stack Dev",
    text: "I'm Alex, a full-stack engineer experienced in Python, FastAPI, React, and PostgreSQL. Built scalable APIs and interested in fintech and automated developer workflows. Available 20 hrs/week for fast-paced hackathons.",
  },
  {
    role: "AI / LLM Specialist",
    text: "I'm Priya, specialized in LangChain, Python, PyTorch, and prompt engineering. Experienced in building multi-agent systems and vector databases. Interested in healthtech and education. Available weekends and evenings.",
  },
];

const PLACEHOLDER = SAMPLES[0].text;

function AddProfilePage() {
  const [text, setText] = useState("");
  const run = useServerFn(extractProfile);
  const mutation = useMutation({
    mutationFn: (value: string) => run({ data: { text: value } }),
  });

  const profile = mutation.data;
  const charCount = text.trim().length;
  const isValidLength = charCount >= 10;

  return (
    <PageShell
      title="Add your profile"
      subtitle="Write about yourself the way you'd tell a friend — skills, interests, availability, experience. AI pulls out the structure."
    >
      <form
        className="surface-card relative overflow-hidden p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (isValidLength) mutation.mutate(text.trim());
        }}
      >
        {/* Form Card Top Decorative Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <label htmlFor="profile-text" className="text-sm font-bold text-foreground">
                Candidate Bio & Experience
              </label>
              <p className="text-[11px] text-muted-foreground">Describe your tech stack, projects, and weekly hours</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <Zap className="h-3 w-3" />
            <span>AI Parser Ready</span>
          </span>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-amber" />
            <span className="font-medium">Quick Inspiration:</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <button
                key={sample.role}
                type="button"
                onClick={() => setText(sample.text)}
                className="group flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground active:scale-95"
              >
                <Sparkles className="h-3 w-3 text-primary/70 transition-transform group-hover:rotate-12" />
                <span>{sample.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="relative mt-4">
          <Textarea
            id="profile-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={8}
            className="w-full resize-y rounded-2xl border-border/80 bg-background/60 p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Card Footer Actions & Status */}
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
                <Loader2 className="h-4 w-4 animate-spin" /> Parsing profile…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Parse & save profile
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Loading Indicator */}
      {mutation.isPending && (
        <PendingCard message="Reading your intro and extracting skills, domains and availability…" />
      )}

      {/* Error Message */}
      {mutation.isError && (
        <p className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive-foreground">
          {(mutation.error as Error).message}
        </p>
      )}

      {/* Success Result Profile Card */}
      {profile && !mutation.isPending && (
        <div className="surface-card animate-fade-up relative mt-8 overflow-hidden p-7 sm:p-8">
          {/* Top Decorative Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="gradient-surface grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold text-primary-foreground shadow-md shadow-primary/30">
                {(profile.name ?? "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">{profile.name ?? "Anonymous"}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Profile Saved</span>
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">Candidate ID: {profile.id?.slice(0, 8) ?? "Live"}</p>
              </div>
            </div>

            <Link
              to="/find-team"
              className="group inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <span>Match with a project</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Extracted Structured Data */}
          <div className="mt-6 grid gap-6">
            <TagList label="Extracted Skills" items={profile.skills ?? []} />
            <TagList label="Domain Interests" items={profile.domains ?? []} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetaField label="Availability" value={profile.availability} />
              <MetaField label="Experience Level" value={profile.experience_level} />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export function PendingCard({ message }: { message: string }) {
  return <LoadingDots message={message} />;
}
