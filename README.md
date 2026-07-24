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

| Skill | Purpose |
| --- | --- |
| [ready-development](skills/ready-development/) | Turn requirements into approved technical designs and reviewable implementation Issues. |
| [writing-prd](skills/writing-prd/) | Clarify product decisions and write focused PRDs. |

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

## Skill Usage Examples and Expected Results

These skills are interactive workflows rather than one-shot generators. The
agent investigates facts it can discover, asks for one decision at a time, and
waits for approval at the workflow's explicit gates.

### `writing-prd`

Use [`writing-prd`](skills/writing-prd/) when a product idea needs a clear MVP
boundary and a reviewable product requirements document.

Example prompt:

```text
Use $writing-prd to turn our customer request for passwordless sign-in into a
focused MVP PRD. Save it under docs/product/. Email magic links are in scope;
social login and account recovery are not.
```

The skill interviews the product owner chapter by chapter, confirms the problem
and scope before adding detail, and keeps implementation choices out of the
product requirements. During the workflow, expect focused questions such as:

```text
Recommendation: expire each sign-in link after its first successful use so a
forwarded or reopened link cannot create another session. The trade-off is that
users must request a new link after using it once. Should this be the MVP rule?
```

Expected result:

- A focused PRD, normally at `docs/product/<feature>-prd.md`.
- Confirmed users, goals, scope, non-goals, flows, business rules, and release
  expectations expressed in product language.
- Traceable `US-*`, `FR-*`, `BR-*`, and `AC-*` identifiers.
- Deferred ideas recorded as non-goals or follow-ups, with genuine blockers
  left visibly open instead of silently assumed.

An abbreviated output might look like:

```markdown
# Passwordless Sign-In PRD

## Scope and Non-Goals
- In scope: request and use a single-use email sign-in link.
- Out of scope: social login and account recovery.

## Functional Requirements
- FR-1: A registered user can request a sign-in link for their email.

## Acceptance Criteria
- AC-1: Given a valid unused link, the user can sign in once.
- AC-2: A used or expired link does not sign the user in.
```

### `ready-development`

Use [`ready-development`](skills/ready-development/) when the product boundary
is stable and engineering needs an approved technical design plus an executable
Issue sequence before implementation begins.

Example prompt:

```text
Use $ready-development with docs/product/passwordless-sign-in-prd.md. Ground the
design in the current repository, write it under docs/design/, and prepare
independently reviewable GitHub Issue drafts. Do not implement production code.
```

The skill traces current modules, contracts, data ownership, failure paths, and
test seams in the repository. It then resolves the design chapter by chapter,
asking for approval on one consequential choice at a time. After the complete
technical design is approved, it proposes an ordered Issue plan and asks before
publishing anything to a tracker.

Expected result:

- A codebase-grounded technical design at the repository's chosen design path,
  covering ownership, interfaces, flows, data, security, operations, rollout,
  rollback, and tests where applicable.
- An evidence and decision trail that distinguishes confirmed choices,
  assumptions, open questions, and out-of-scope work.
- Requirement-to-design and requirement-to-test traceability.
- Ordered, dependency-aware Issue drafts sized as independently testable,
  reviewable, deployable, and reversible vertical slices.
- Published tracker Issues only after explicit approval and successful
  read-back; otherwise, saved Issue drafts.
- No production implementation, implementation commit, or pull request.

An abbreviated handoff might look like:

```text
Technical design: docs/design/passwordless-sign-in.md

Issue plan:
1. Define the single-use token contract and public behavior tests
2. Persist token lifecycle and enforce atomic consumption (depends on 1)
3. Add the sign-in endpoint and operational telemetry (depends on 2)

First unblocked Issue: 1
Implementation started: no
```

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
