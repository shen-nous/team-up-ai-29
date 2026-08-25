import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TextInput = z.object({ text: z.string().min(10).max(6000) });

export const extractProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TextInput.parse(input))
  .handler(async ({ data }) => {
    const { callGatewayJson } = await import("./ai.server");
    const { getServerSupabase } = await import("./db.server");

    const parsed = await callGatewayJson<{
      name: string;
      skills: string[];
      domains: string[];
      availability: string;
      experience_level: string;
    }>({
      system:
        "You extract structured teammate profiles from free-form text for a hackathon team-matching app. " +
        "Return only fields supported by the text. Skills are concrete technologies or crafts (e.g. React, Figma, Rust, ML). " +
        "Domains are interest areas (e.g. fintech, healthcare, developer tools). " +
        "availability is a short phrase like '10 hrs/week' or 'weekends only'; use 'unspecified' if absent. " +
        "experience_level must be one of: beginner, intermediate, advanced, expert, unspecified. " +
        "name is the person's name or handle if stated, otherwise 'Anonymous'.",
      user: data.text,
      schemaName: "profile_extraction",
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
          domains: { type: "array", items: { type: "string" } },
          availability: { type: "string" },
          experience_level: { type: "string" },
        },
        required: ["name", "skills", "domains", "availability", "experience_level"],
        additionalProperties: false,
      },
    });

    const supabase = getServerSupabase();
    const { data: row, error } = await supabase
      .from("profiles")
      .insert({
        raw_text: data.text,
        name: parsed.name || "Anonymous",
        skills: parsed.skills ?? [],
        domains: parsed.domains ?? [],
        availability: parsed.availability ?? "unspecified",
        experience_level: parsed.experience_level ?? "unspecified",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const extractProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TextInput.parse(input))
  .handler(async ({ data }) => {
    const { callGatewayJson } = await import("./ai.server");
    const { getServerSupabase } = await import("./db.server");

    const parsed = await callGatewayJson<{
      title: string;
      needed_skills: string[];
      domains: string[];
      team_size: number;
    }>({
      system:
        "You extract structured project briefs from free-form text for a hackathon team-matching app. " +
        "needed_skills are the concrete skills the team is missing or looking for. " +
        "domains are the project's problem areas. team_size is the total desired team size as an integer (use 4 if unstated). " +
        "title is a short 2-5 word project name derived from the text.",
      user: data.text,
      schemaName: "project_extraction",
      schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          needed_skills: { type: "array", items: { type: "string" } },
          domains: { type: "array", items: { type: "string" } },
          team_size: { type: "integer" },
        },
        required: ["title", "needed_skills", "domains", "team_size"],
        additionalProperties: false,
      },
    });

    const supabase = getServerSupabase();
    const { data: row, error } = await supabase
      .from("projects")
      .insert({
        raw_text: data.text,
        title: parsed.title || "Untitled project",
        needed_skills: parsed.needed_skills ?? [],
        domains: parsed.domains ?? [],
        team_size: parsed.team_size ?? 4,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { getServerSupabase } = await import("./db.server");
  const { data, error } = await getServerSupabase()
    .from("projects")
    .select("id, title, raw_text, needed_skills, domains, team_size, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const matchTeam = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ projectId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { callGatewayJson } = await import("./ai.server");
    const { getServerSupabase } = await import("./db.server");
    const supabase = getServerSupabase();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", data.projectId)
      .single();
    if (projectError || !project) throw new Error("Project not found.");

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (profilesError) throw new Error(profilesError.message);
    if (!profiles || profiles.length === 0) {
      return {
        matches: [] as Array<{
          profile_id: string;
          name: string;
          skills: string[];
          score: number;
          reasoning: string;
        }>,
      };
    }

    const result = await callGatewayJson<{
      matches: Array<{ profile_id: string; score: number; reasoning: string }>;
    }>({
      system:
        "You are a hackathon team-formation analyst. For each candidate, first reason about which specific gap in the " +
        "project's needed skills that person fills, how their domain interests and availability align, and what risks " +
        "remain. Then assign an integer score 0-100 reflecting overall fit for THIS project. " +
        "The reasoning must be 1-2 sentences naming the concrete skill gap filled (or why they are a weak fit) — " +
        "never a generic similarity statement. Include every candidate exactly once, using their exact profile_id.",
      user: JSON.stringify({
        project: {
          title: project.title,
          description: project.raw_text,
          needed_skills: project.needed_skills,
          domains: project.domains,
          team_size: project.team_size,
        },
        candidates: profiles.map((p) => ({
          profile_id: p.id,
          name: p.name,
          skills: p.skills,
          domains: p.domains,
          availability: p.availability,
          experience_level: p.experience_level,
          description: p.raw_text,
        })),
      }),
      schemaName: "team_matches",
      schema: {
        type: "object",
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                profile_id: { type: "string" },
                score: { type: "integer" },
                reasoning: { type: "string" },
              },
              required: ["profile_id", "score", "reasoning"],
              additionalProperties: false,
            },
          },
        },
        required: ["matches"],
        additionalProperties: false,
      },
    });

    const byId = new Map(profiles.map((p) => [p.id, p]));
    const valid = (result.matches ?? [])
      .filter((m) => byId.has(m.profile_id))
      .map((m) => ({
        project_id: project.id,
        profile_id: m.profile_id,
        score: Math.max(0, Math.min(100, Math.round(m.score))),
        reasoning: m.reasoning,
      }));

    if (valid.length > 0) {
      await supabase.from("matches").delete().eq("project_id", project.id);
      const { error: insertError } = await supabase.from("matches").insert(valid);
      if (insertError) throw new Error(insertError.message);
    }

    return {
      matches: valid
        .map((m) => ({
          profile_id: m.profile_id,
          name: byId.get(m.profile_id)?.name ?? "Anonymous",
          skills: byId.get(m.profile_id)?.skills ?? [],
          score: m.score,
          reasoning: m.reasoning ?? "",
        }))
        .sort((a, b) => b.score - a.score),
    };
  });
