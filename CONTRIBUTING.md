# Contributing

Contributions should keep this repository portable, reviewable, and safe to use
with coding agents.

## Prerequisites

- Node.js 18 or newer
- Git

The repository tooling has no third-party runtime dependencies.

## Create a Skill

Use the repository scaffold:

```bash
npm run new:skill -- <skill-name>
```

Skill names must use lowercase letters, numbers, and single hyphens. The command
creates `skills/<skill-name>/SKILL.md` and refuses to overwrite an existing
directory.

Complete the generated file before running validation:

1. Replace the placeholder description with a concise statement of what the
   skill does and when it should be selected.
2. Replace the generic workflow with imperative, task-specific instructions.
3. Add `scripts/`, `references/`, or `assets/` only when the workflow needs
   them.
4. Add the skill to the **Available Skills** section in `README.md` using a link
   to `skills/<skill-name>/`.

Do not add a README, installation guide, changelog, or other process
documentation inside an individual skill. Keep detailed or infrequently used
domain material in `references/`.

Agent-specific metadata such as `agents/openai.yaml` is optional. Add it only
when the skill has real, reviewed interface metadata; it is not part of the
default scaffold.

## Authoring Rules

- Keep `SKILL.md` below 500 lines.
- Use only `name` and `description` in its YAML frontmatter.
- Keep the directory name identical to the frontmatter `name`.
- Put all trigger conditions in `description`, not in a separate "When to Use"
  section.
- Keep descriptions at or below 1,024 characters.
- Prefer existing commands and focused scripts over large embedded code blocks.
- Document confirmation boundaries for destructive or external actions.
- Test every bundled script with representative input.

## Validate Changes

Run the complete local check:

```bash
npm test
npm run validate
git diff --check
```

The validator checks published skill placement, naming, frontmatter, placeholder
content, body length, duplicate names, and README catalog entries. CI also asks
the pinned `skills` CLI to discover the repository whenever at least one skill
has been published.

Before opening a pull request, test the changed skill on a realistic request and
report any known limitations.
