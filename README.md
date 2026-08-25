# Project Matchmaker

Build a web app called "Project Match" — a team formation platform for hackathons and projects.

DATABASE TABLES:

1. profiles: id, raw_text, skills (array), domains (array), availability, experience_level, created_at

2. projects: id, raw_text, needed_skills (array), domains (array), team_size, created_at

3. matches: id, project_id (fk), profile_id (fk), score (int), reasoning (text), created_at

PAGES:

1. "Add Profile" page — a single large text area where a user describes themselves in free text (skills, interests, availability, experience). On submit, send the text to a backend function that calls an LLM to extract structured fields (skills, domains, availability, experience_level) as JSON, then save the profile. Show the parsed result as a card with tags.

2. "Post a Project" page — a text area where a user describes their project and what kind of teammates they need. On submit, extract structured fields (needed_skills, domains, team_size) via LLM the same way, then save. Show the parsed result as a card.

3. "Find a Team" page — a dropdown to select a saved project, and a "Find Matches" button. On click, call a backend function that sends the project's structured data plus ALL saved profiles to an LLM, asking it to rank candidates and explain its reasoning for each (not just a similarity score — explain what skill gap each person fills). Display results as ranked cards: name/id, score, and a short reasoning blurb, sorted highest score first.

BACKEND FUNCTIONS:

- extract-profile: takes raw text, calls the LLM with a strict JSON-schema extraction prompt, saves to profiles table.

- extract-project: same pattern for projects table.

- match-team: takes a project id, loads the project and all profiles, calls the LLM with a reasoning-then-scoring prompt, saves and returns ranked matches.

Use a clean, modern, minimal design — dark theme, card-based layout, clear typography. Show loading states while the LLM calls are running (they take a few seconds).

Do not require user login/auth — keep this open and demo-friendly.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://team-up-ai-29.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/69594532-d58d-4cef-8726-f9db4c762eea).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
