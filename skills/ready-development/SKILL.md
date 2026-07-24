---
name: ready-development
description: Turn a requirement description, PRD, or Issue into an approved codebase-grounded technical design through a one-decision-at-a-time interview, then split the design into ordered, independently reviewable implementation Issues. Use when the user wants to settle a technical solution before implementation.
---

# Ready Development

Take one feature from product intent to a development-ready backlog. Produce an approved technical design with the requested chapters, then an ordered Issue plan. Do not implement production code during this workflow.

Use three anchors throughout the run:

- **Evidence**: derive current behavior, constraints, and likely touchpoints from the repository rather than memory or guesses.
- **Design gates**: close one technical-design chapter before moving to the next.
- **Tracer bullets**: slice delivery into the smallest end-to-end changes that can be tested, reviewed, deployed, and reverted independently.

## Entry gate

If the invocation contains no requirement description, PRD path, Issue, or relevant conversation context, ask exactly one equivalent question in the user's language and wait:

> Which feature do you want to make development-ready? Provide a requirement description, a PRD or Issue, or the desired outcome and scope.

Do not infer a feature from the repository name, code, documentation, or adjacent capabilities. Inspect the workspace only after the user supplies the product input.

## Operating contract

- Obtain discoverable facts from repository files and available tools; ask the user only for decisions.
- Resolve one highest-impact open decision at a time. Before asking, provide one recommended answer with its trade-off and repository evidence, then wait.
- After each answer, restate the confirmed decision, update the decision ledger, and check it against prior decisions, product scope, and current evidence.
- Use the repository's established domain language. Surface ambiguous, overloaded, or conflicting terms immediately and record the resolved meaning in the technical design.
- Prefer existing ownership, modules, and interfaces. Introduce a new seam only when behavior genuinely varies there or an agreed public test surface requires it.
- Treat an interface as the complete caller contract, including invariants, errors, ordering, configuration, and relevant performance expectations. Use the same public seam for callers and behavior tests.
- Define tests through observable behavior. Plan each implementation Issue as a small failing-test-to-minimum-implementation vertical slice, but do not write tests or implementation code in this workflow.
- Do not create separate product, glossary, domain-model, or decision documents unless the user explicitly requests them.

## Step 1: Confirm the product input

Accept any of these as the product input:

- a PRD or other requirement document;
- an Issue or feature tracker;
- a requirement description;
- confirmed requirements in the current conversation.

The input is sufficient when it identifies:

1. the user or business outcome;
2. included behavior;
3. an explicit scope boundary;
4. an observable acceptance result.

If any item is missing or contradictory, ask one highest-impact product-boundary question at a time and wait. Clarify only enough product behavior to stabilize the technical-design boundary; do not silently expand the feature or turn this workflow into a full PRD exercise.

Preserve existing requirement identifiers. When the input has none, assign stable `REQ-*` and `AC-*` identifiers inside the technical design. Refer to the source consistently as the **product input**, whether or not a formal PRD exists.

Treat confirmed non-goals as entry constraints. When a requested design contradicts them or introduces a new user capability, surface the conflict and ask whether the product input should change before beginning technical design.

**Complete when:** one feature has a stable outcome, included behavior, scope boundary, and observable acceptance result.

## Step 2: Build the evidence map

Read repository instructions first. Then inspect:

- the product input and related product documents;
- the requested technical-design template and chapters, or the repository's default template;
- the domain glossary or context documentation;
- related architecture documents, modules, interfaces, callers, migrations, tests, and configuration;
- identity, authorization, isolation, operational, and trust boundaries;
- issue-tracker conventions and existing Issues that may overlap.

Use repository graph or code-navigation tools before broad text search when available. Trace current behavior, data ownership, callers, dependencies, failure paths, and test seams through actual code.

Summarize:

- **Evidence**: exact files, symbols, contracts, and current behavior;
- **Constraints**: compatibility, security, data, rollout, and operational limits;
- **Contradictions**: places where product input, documentation, and code disagree;
- **Open decisions**: choices that still affect architecture, safety, or Issue slicing.

Do not resolve a contradiction by assumption when the answer would change product behavior or the technical boundary.

**Complete when:** every proposed change area is tied to current repository evidence and every material contradiction is visible.

## Step 3: Lock scope and create the design skeleton

State:

1. the one-sentence implementation goal;
2. included requirements and acceptance criteria;
3. explicit technical non-goals;
4. existing behavior and contracts that must remain compatible;
5. the likely owning domain and module, supported by evidence.

Maintain this decision ledger throughout the interview:

- **Confirmed**: approved technical decisions.
- **Open**: unresolved decisions that affect the design or Issue boundaries.
- **Assumptions**: low-risk temporary choices that remain visible until confirmed or removed.
- **Out of scope**: adjacent improvements deferred from this delivery.
- **Evidence**: repository facts supporting or constraining decisions.

Test every proposed addition with: **Does the confirmed product outcome fail without it?** Move anything else out of scope. Ask the user to approve the implementation scope before designing internals.

After approval, create the technical-design document skeleton using this priority:

1. the user's specified location, template, chapters, and order;
2. the repository's technical-design convention;
3. the default design gates in Step 4.

Preserve empty chapters while decisions remain open. Mark a chapter not applicable only with an explicit reason; do not invent design content merely to fill the template.

**Complete when:** one coherent implementation boundary is approved and the technical-design skeleton exists at the intended path.

## Step 4: Resolve and write the design chapter by chapter

Walk the requested or repository-defined chapters in their specified order. If neither defines the structure, use these default design gates:

| Gate | Pressure test | Completion criterion |
| --- | --- | --- |
| 1. Design overview | Which requirements change the system? What remains untouched? Which compatibility rules bind the solution? | Every in-scope requirement maps to a technical responsibility and every technical non-goal is explicit. |
| 2. Architecture and responsibilities | Which domain and module own each behavior and data object? Which existing interfaces, callers, dependencies, and seams change? | Every changed responsibility has one owner, and diagrams show non-trivial calls, ownership, and stable seams. |
| 3. Core flows | What starts each flow? Where are the consistency boundaries? What happens on concurrency, retries, partial failure, or cancellation? | Every critical flow has a success path, material failure paths, consistency rules, and a sequence diagram when interactions are non-trivial. |
| 4. Identity, authorization, and isolation | Where does trusted identity originate? How is access decided? Which trust or tenant boundaries are crossed? | Every protected path has an identity source, access decision point, isolation rule, and denial behavior. |
| 5. Data model and migration | What are the canonical resources, ownership, invariants, states, constraints, indexes, retention, and rollout needs? | Every data change has a stable shape, safe migration order, compatibility plan, and rollback or explicit irreversibility. |
| 6. Interfaces, integrations, and operations | Which user, internal, event, or third-party contracts change? What are their errors, compatibility, idempotency, observability, and rollout behavior? | Every changed contract is explicit and callers and operators can adopt it without guessing. |
| 7. Tests and acceptance | Which public seams prove behavior? Which normal, failure, security, isolation, migration, and compatibility cases matter? | Every requirement and material risk maps to an observable test case at an agreed seam. |

For each chapter:

1. investigate the relevant repository facts;
2. list the open decisions that block the completion criterion;
3. choose the highest-impact decision;
4. present one recommendation with its trade-off and evidence;
5. ask one question and wait;
6. update the ledger and check scope and consistency;
7. write the confirmed result into the technical design;
8. repeat until the chapter closes.

Use Mermaid diagrams only when relationships, ownership, states, or cross-module sequences are materially clearer than prose. Keep simple local behavior in prose or tables.

The design must make these facts explicit where applicable:

- domain, module, and data ownership;
- interfaces, seams, adapters, callers, dependencies, invariants, and errors;
- resource shapes, state transitions, schema evolution, and migration order;
- identity, authorization, isolation, and trust boundaries;
- consistency, concurrency, failure handling, observability, rollout, and rollback;
- public test seams, behavior cases, and requirement coverage.

**Complete when:** every applicable chapter meets its completion criterion, the Open ledger contains no blocking decision, and no material assumption is hidden.

## Step 5: Approve the technical design

Audit the completed design with the user one finding or decision at a time:

1. **Scope**: every design element is necessary for the confirmed outcome.
2. **Evidence**: file and symbol references still match the current repository.
3. **Ownership**: each behavior and data object has one authoritative owner.
4. **Interfaces**: callers, invariants, errors, compatibility, and trust are explicit.
5. **Safety**: migration, concurrency, failure, isolation, rollout, and rollback are addressed where relevant.
6. **Traceability**: each requirement reaches an implementation responsibility and test case.
7. **Testability**: each behavior is observable through an agreed public seam.

Present blockers, unresolved assumptions, and scope drift before proposing work items. Ask the user to approve the complete technical design.

**Complete when:** the user approves the design, every blocking question is closed, and a developer can implement the feature without inventing architecture, contracts, data rules, or test behavior.

## Step 6: Slice and publish Issues

Only after Step 5 completes, read [`references/issue-slicing.md`](references/issue-slicing.md) in full. Produce an ordered Issue plan with dependencies and show it to the user before any tracker write.

Always produce reviewable Issue drafts. Publish them only after explicit approval:

- When a target tracker and its conventions are discoverable, create the Issues and verify their content, dependencies, labels, and links.
- When no tracker is configured or tracker access is unavailable, save the Issue drafts using the repository's documentation convention or append them to the technical design.
- When several tracker targets remain possible, ask one question rather than guessing.

Stop after identifying the first unblocked Issue. Leave tests, production code, implementation commits, pushes, and implementation PRs to later sessions, each scoped to one approved Issue.

**Complete when:** an ordered, dependency-aware set of independently reviewable Issues links back to the product input and technical design, the publication result is verified, and no implementation work has started.
