<div align="center">

# Agent-Ready Skills

**Turn repeatable workflows into portable skills for coding agents.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/collection-personal%20skills-6f42c1.svg)](skills/)
[![Format](https://img.shields.io/badge/format-Agent%20Skills-2563eb.svg)](https://agentskills.io)
[![Status](https://img.shields.io/badge/status-growing-22c55e.svg)](#available-skills)

</div>

## What This Is

This repository is a personal collection of reusable workflows for AI coding
agents. Each published skill follows the open
[Agent Skills specification](https://agentskills.io/specification) and keeps its
instructions, scripts, references, and assets in one self-contained directory.

The collection is designed to work across compatible agents. Codex is an
explicitly supported target.

## Available Skills

_No published skills yet._

Skills will appear here after they pass repository validation and a realistic
usage check.

## Install a Skill

### Requirements

- Node.js 18 or newer
- An Agent Skills-compatible coding agent

First, list the skills available in this repository:

```bash
npx skills add shawndenggh/skills --list
```

Before installing a skill, review its `SKILL.md` and any bundled scripts. Skills
run with the permissions available to your agent.

Install one skill into the current project:

```bash
npx skills add shawndenggh/skills --skill <skill-name>
```

To target Codex explicitly:

```bash
npx skills add shawndenggh/skills --skill <skill-name> --agent codex
```

A project installation writes agent files under the current project and creates
a `skills-lock.json` file. For Codex, the skill is installed under
`.agents/skills/`.

To make a skill available across projects, use a global installation:

```bash
npx skills add shawndenggh/skills --skill <skill-name> --global
```

Project-scoped installation is recommended by default because it keeps the
trusted skill set explicit for each codebase.

## Use and Manage Skills

Invoke a skill explicitly by mentioning it in your prompt:

```text
Use $skill-name to ...
```

Compatible agents may also select a skill automatically when the request matches
the skill's description.

```bash
# List installed skills
npx skills list

# Update one installed skill
npx skills update <skill-name>

# Remove one installed skill
npx skills remove <skill-name>
```

See the [`skills` CLI documentation](https://www.skills.sh/docs/cli) for
agent-specific and non-interactive options.

## Repository Structure

```text
.
├── .github/workflows/       # Continuous validation
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md         # Required metadata and instructions
│       ├── agents/          # Optional agent-specific UI metadata
│       ├── scripts/         # Optional deterministic helpers
│       ├── references/      # Optional on-demand documentation
│       └── assets/          # Optional output resources
├── scripts/                 # Repository authoring and validation tools
├── templates/skill/
│   └── SKILL.md.template    # Non-discoverable starter template
├── tests/                   # Tests for repository tooling
├── AGENTS.md
├── CONTRIBUTING.md
└── LICENSE
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before creating or changing a skill.
The short version is:

```bash
npm run new:skill -- <skill-name>
# Complete the generated SKILL.md and update the catalog above.
npm test
npm run validate
```

Keep each skill focused. Put trigger conditions in the frontmatter description,
keep the common workflow in `SKILL.md`, and add resource directories only when
they directly support the workflow.

## License

Unless otherwise noted, this repository is licensed under the
[MIT License](LICENSE).

<div align="center">

**Personal knowledge, packaged for repeatable agent work.**

</div>
