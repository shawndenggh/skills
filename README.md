# Shawn Deng's Personal Skills

A collection of personal AI skills for reusable workflows, domain knowledge,
and automation.

These skills support my development, operations, writing, and daily work. They
may also be used as references or building blocks for other AI agents.

## Repository Structure

```text
.
├── skills/              # Skills ready to use
│   └── <skill-name>/
│       ├── SKILL.md     # Required skill instructions
│       ├── agents/      # Optional agent UI metadata
│       ├── scripts/     # Optional executable scripts
│       ├── references/  # Optional on-demand reference material
│       └── assets/      # Optional templates and other assets
└── templates/           # Templates for creating new skills
```

## Available Skills

Skills are being added over time and will be organized by purpose, for example:

- Development: coding and code review
- DevOps: deployment, diagnostics, and operations
- Writing: editing and content publishing
- Productivity: personal efficiency and automation
- Domain: project- or business-specific knowledge

## How to Add a Skill

1. Create a directory under `skills/` using lowercase letters, numbers, and hyphens.
2. Add the required `SKILL.md` with `name` and `description` in its YAML frontmatter.
3. Include only the instructions, scripts, and references needed to perform the task.
4. Move complex or low-frequency material into `references/` and link to it from `SKILL.md`.
5. Test the skill against a realistic task before submitting changes.

Example:

```text
skills/
└── example-skill/
    └── SKILL.md
```

## Skill Design Principles

- **Concise**: preserve agent context by documenting only what is necessary.
- **Actionable**: describe clear steps, decision points, and verification methods.
- **Progressive disclosure**: keep core workflows in `SKILL.md` and load details on demand.
- **Reusable**: turn personal experience into stable, transferable workflows.
- **Safety first**: define confirmation and rollback boundaries for external publishing,
  data deletion, and production changes.

## License

Unless otherwise noted, this repository is licensed under the [MIT License](LICENSE).
