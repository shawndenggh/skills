<div align="center">

# Personal Skills

**Turn coding experience into agent-ready skills.**

Built for practical work with coding agents — concise instructions, focused context,
and repeatable results.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/collection-personal%20skills-6f42c1.svg)](skills/)
[![Format](https://img.shields.io/badge/format-SKILL.md-2563eb.svg)](templates/skill/SKILL.md)
[![Status](https://img.shields.io/badge/status-growing-22c55e.svg)](#available-skills)

</div>

## Contents

- [What This Is](#what-this-is)
- [Available Skills](#available-skills)
- [Repository Structure](#repository-structure)
- [Skill Format](#skill-format)
- [How to Add a Skill](#how-to-add-a-skill)
- [Design Principles](#design-principles)
- [Validation Checklist](#validation-checklist)
- [License](#license)

## What This Is

This repository is my personal library of AI skills. Each skill captures a focused
workflow that an agent can apply repeatedly without rediscovering the same project
context, preferences, or operating rules.

The collection will cover areas such as:

- Development and code review
- DevOps, deployment, and diagnostics
- Writing and content publishing
- Personal productivity and automation
- Project- and domain-specific knowledge

The goal is not to collect generic prompt snippets. A useful skill should give an
agent enough context to make better decisions, follow a reliable workflow, and verify
the result.

## Available Skills

Skills will be added here as they become ready for reuse.

| Skill | Category | Description |
|-------|----------|-------------|
| _Coming soon_ | — | The first personal skills are being organized. |

## Repository Structure

```text
.
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md     # Required instructions and metadata
│       ├── agents/      # Optional agent UI metadata
│       ├── scripts/     # Optional executable scripts
│       ├── references/  # Optional on-demand reference material
│       └── assets/      # Optional templates and other assets
├── templates/
│   └── skill/
│       └── SKILL.md     # Starter template for a new skill
├── LICENSE
└── README.md
```

## Skill Format

Every skill lives in its own directory and must include a `SKILL.md` file with YAML
frontmatter:

```markdown
---
name: example-skill
description: Describe what this skill does and when it should be used.
---

# Example Skill

## Workflow

1. Inspect the relevant context.
2. Perform the task using the preferred workflow.
3. Verify the result and report remaining risks.
```

Keep the core instructions in `SKILL.md`. Move large or low-frequency material into
`references/`, and use `scripts/` for deterministic operations that should not be
rewritten by an agent each time.

## How to Add a Skill

1. Create a directory under `skills/` using lowercase letters, numbers, and hyphens.
2. Start from [`templates/skill/SKILL.md`](templates/skill/SKILL.md).
3. Define a precise `name` and a trigger-oriented `description`.
4. Document the workflow, decision points, safety rules, and verification steps.
5. Add references, scripts, or assets only when they directly support the skill.
6. Test the skill against a realistic task before committing it.
7. Add the skill to the table above with its category and a short description.

## Design Principles

- **Concise** — preserve context by documenting only what the agent needs.
- **Actionable** — prefer clear steps, conditions, examples, and checks.
- **Progressive** — keep the common path in `SKILL.md`; load details on demand.
- **Reusable** — capture stable workflows instead of one-off answers.
- **Honest** — document limitations and uncertainty rather than making broad claims.
- **Safe** — define confirmation and rollback boundaries for external or destructive actions.

## Validation Checklist

Before publishing a skill, check that:

- `SKILL.md` has valid `name` and `description` frontmatter.
- The directory name uses lowercase letters, numbers, and hyphens only.
- The instructions are specific enough to trigger and execute reliably.
- External actions, secrets, and destructive operations have explicit guardrails.
- Examples and scripts work from a clean checkout.
- The skill does not duplicate information already available in the agent.

## License

Unless otherwise noted, this repository is licensed under the [MIT License](LICENSE).

<div align="center">

**Personal knowledge, packaged for repeatable AI work.**

</div>
