import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createSkill } from "../scripts/new-skill.mjs";
import {
  isValidSkillName,
  validateRepository,
} from "../scripts/validate-skills.mjs";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "agent-skills-test-"));
  await mkdir(path.join(root, "skills"), { recursive: true });
  await mkdir(path.join(root, "templates", "skill"), { recursive: true });
  const template = await readFile(
    path.join(repositoryRoot, "templates", "skill", "SKILL.md.template"),
    "utf8",
  );
  await writeFile(
    path.join(root, "templates", "skill", "SKILL.md.template"),
    template,
  );
  await writeFile(path.join(root, "README.md"), "_No published skills yet._\n");
  return root;
}

function validSkill(
  name,
  description = "Review pull requests. Use for PR review.",
) {
  return `---
name: ${name}
description: "${description}"
---

# ${name}

1. Inspect the change.
2. Verify the result.
`;
}

test("skill names follow the portable naming contract", () => {
  assert.equal(isValidSkillName("review-pr"), true);
  assert.equal(isValidSkillName("review2-pr"), true);
  assert.equal(isValidSkillName("Review-PR"), false);
  assert.equal(isValidSkillName("review--pr"), false);
  assert.equal(isValidSkillName("-review-pr"), false);
  assert.equal(isValidSkillName("a".repeat(64)), false);
});

test("an empty repository validates without publishing the template", async () => {
  const root = await createFixture();
  const result = await validateRepository(root);

  assert.deepEqual(result.errors, []);
  assert.equal(result.skills.length, 0);
});

test("a valid published skill must be listed in README", async () => {
  const root = await createFixture();
  await mkdir(path.join(root, "skills", "review-pr"));
  await writeFile(
    path.join(root, "skills", "review-pr", "SKILL.md"),
    validSkill("review-pr"),
  );

  let result = await validateRepository(root);
  assert.match(result.errors.join("\n"), /README\.md: add "review-pr"/);

  await writeFile(
    path.join(root, "README.md"),
    "| [review-pr](skills/review-pr/) | Review pull requests. |\n",
  );
  result = await validateRepository(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.skills.length, 1);
});

test("validation reports malformed and misplaced skills", async () => {
  const root = await createFixture();
  await mkdir(path.join(root, "skills", "wrong-folder"));
  await writeFile(
    path.join(root, "skills", "wrong-folder", "SKILL.md"),
    `---
name: duplicate-name
---

# TODO
`,
  );
  await mkdir(path.join(root, "skills", "second-folder"));
  await writeFile(
    path.join(root, "skills", "second-folder", "SKILL.md"),
    validSkill("duplicate-name", "TODO: write this description"),
  );
  await mkdir(path.join(root, "templates", "accidental"));
  await writeFile(
    path.join(root, "templates", "accidental", "SKILL.md"),
    validSkill("accidental"),
  );
  await mkdir(path.join(root, "skills", "Bad_Name"));
  await writeFile(
    path.join(root, "skills", "Bad_Name", "SKILL.md"),
    validSkill("bad-name"),
  );

  const result = await validateRepository(root);
  const errors = result.errors.join("\n");

  assert.match(errors, /missing required frontmatter field "description"/);
  assert.match(errors, /directory name must be under 64 characters/);
  assert.match(errors, /must match directory "wrong-folder"/);
  assert.match(errors, /duplicate skill name "duplicate-name"/);
  assert.match(errors, /replace the placeholder description/);
  assert.match(errors, /publishable SKILL\.md files must live directly/);
});

test("the scaffold creates one skill and refuses invalid or existing names", async () => {
  const root = await createFixture();
  const skillPath = await createSkill(root, "review-pr");
  const content = await readFile(skillPath, "utf8");

  assert.match(content, /^name: review-pr$/m);
  assert.match(content, /# Review Pr/);
  await assert.rejects(() => createSkill(root, "review-pr"), /EEXIST/);
  await assert.rejects(
    () => createSkill(root, "Review_PR"),
    /Skill name must be under 64 characters/,
  );
});
