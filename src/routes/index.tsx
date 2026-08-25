import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

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

const PLACEHOLDER =
  "I'm Maya, a frontend dev comfortable with React, TypeScript and Tailwind. I've shipped two ML side projects and I'm into climate tech and developer tools. I can do about 15 hours a week, mostly evenings. Been coding professionally for 3 years.";

function AddProfilePage() {
  const [text, setText] = useState("");
  const run = useServerFn(extractProfile);
  const mutation = useMutation({
    mutationFn: (value: string) => run({ data: { text: value } }),
  });

  const profile = mutation.data;

  return (
    <PageShell
      title="Add your profile"
      subtitle="Write about yourself the way you'd tell a friend — skills, interests, availability, experience. AI pulls out the structure."
    >
      <form
        className="surface-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim().length >= 10) mutation.mutate(text.trim());
        }}
      >
        <label htmlFor="profile-text" className="text-sm font-medium">
          Tell us about yourself
        </label>
        <Textarea
          id="profile-text"
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

      {mutation.isPending && <PendingCard message="Reading your intro and extracting skills, domains and availability…" />}

      {mutation.isError && (
        <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {(mutation.error as Error).message}
        </p>
      )}

      {profile && !mutation.isPending && (
        <div className="surface-card animate-fade-up mt-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{profile.name ?? "Anonymous"}</h2>
            <span className="pill-tag px-3 py-1 text-xs font-semibold">Saved</span>
          </div>
          <div className="mt-5 grid gap-5">
            <TagList label="Skills" items={profile.skills ?? []} />
            <TagList label="Domains" items={profile.domains ?? []} />
            <div className="grid grid-cols-2 gap-4">
              <MetaField label="Availability" value={profile.availability} />
              <MetaField label="Experience" value={profile.experience_level} />
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
