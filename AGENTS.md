# Repository Guidelines

## Purpose

This repository publishes portable Agent Skills. Treat every
`skills/<skill-name>/SKILL.md` as executable agent guidance, not general
documentation.

## Structure

- Put publishable skills only under `skills/<skill-name>/`.
- Keep the folder name identical to the frontmatter `name`.
- Use `templates/skill/SKILL.md.template` only through the scaffold command; it
  must never be renamed to `SKILL.md` outside `skills/`.
- Add `scripts/`, `references/`, and `assets/` inside a skill only when needed.
- Do not add README or changelog files inside individual skills.

## Authoring

- Create a skill with `npm run new:skill -- <skill-name>`.
- Use only `name` and `description` in `SKILL.md` frontmatter.
- Make the description explain both capability and trigger conditions.
- Write the body as concise imperative instructions and keep it below 500
  lines.
- Keep repository-facing documentation in English. Preserve the intentional
  language of an individual skill.
- Update the README catalog whenever a skill is added, renamed, or removed.

## Verification

Run:

```bash
npm test
npm run validate
git diff --check
```

Test bundled scripts directly and test changed skills against realistic prompts.
Review external commands for permissions, secrets, destructive behavior, and
rollback expectations.

Do not stage generated files, dependency caches, or unrelated user changes.
