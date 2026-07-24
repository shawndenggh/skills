# Issue Slicing

Read this reference only after the technical design has passed its development-readiness review and the user has approved it.

## Slice by tracer bullet

Make each Issue one small vertical change that produces an observable result through one primary public seam. A good Issue can be tested, reviewed, merged, deployed, and reverted without requiring reviewers to understand the whole feature at once.

Prefer this order:

1. a compatibility prerequisite only when safe rollout requires it;
2. the thinnest end-to-end behavior through the chosen seam;
3. additional rules and failure behaviors as separate vertical slices;
4. integrations, import, audit, or operations only when they are in scope;
5. final cross-slice verification only when it proves behavior not already covered.

A standalone database, interface, or infrastructure Issue earns its place only when it is independently verifiable and must land before a behavior slice for compatibility or deployment safety. Otherwise keep the enabling work inside the tracer bullet that first uses it.

## Sizing gate

Every proposed Issue must satisfy all of these:

- delivers one caller- or user-observable capability, or one required compatibility prerequisite;
- centers on one agreed public test seam and a short failing-test-to-minimum-implementation sequence;
- has explicit dependencies and can start when those dependencies close;
- changes only the modules necessary for its result;
- has acceptance criteria that can pass before later Issues exist;
- can be reviewed and reverted as one focused Pull Request;
- contains no deferred cleanup or adjacent product capability.

Split again when an Issue contains multiple outcomes, crosses unrelated seams, has independent rollback decisions, or cannot be reviewed without mentally simulating later work.

## Issue body

Use the repository's tracker or documentation conventions and inspect existing Issues for duplicates. Give every Issue this information:

```markdown
## Goal

<one observable result>

## Requirement source

- Product input: <PRD, Issue, confirmed description, or conversation reference>
- Requirements: <REQ/FR/BR/AC identifiers>
- Technical design: <document link and relevant chapters, flows, models, or TC identifiers>

## Scope

- <behavior included in this Issue>

## Codebase evidence

- <current modules, interfaces, tests, migrations, or configuration this slice builds on>

## Test-first slice

1. Red: <failing behavior test through the agreed public seam>
2. Green: <minimum implementation that makes it pass>
3. Repeat only for another behavior required by this same observable result.

## Acceptance criteria

- [ ] <independently observable completion condition>

## Dependencies

- Blocked by: <Issue title/link or none>

## Non-goals

- <adjacent work intentionally excluded>
```

Mention likely code touchpoints as evidence, not as a frozen file checklist. The technical design remains the source of truth for contracts and architecture; Issues point to it instead of copying whole sections.

## Approval and publication

Before tracker or document writes:

1. show each ordered Issue title, observable result, primary seam, and dependency;
2. explain why each boundary is independently reviewable;
3. ask for explicit approval of the Issue plan.

After approval:

- Use the configured tracker and its native dependency relationships when one is available.
- Apply only labels already defined by the repository or tracker; do not invent workflow labels.
- Link each Issue to its product input and technical design.
- If no tracker is configured or access is unavailable, save the same Issue bodies using the repository's documentation convention or append them to the technical design.
- If several publication targets remain possible, ask one question and wait.

Verify every created or saved Issue body, dependency, label, and link. Report the first unblocked Issue as the recommended next development task, then stop.
