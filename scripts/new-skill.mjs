import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { isValidSkillName } from "./validate-skills.mjs";

const PLACEHOLDER_DESCRIPTION =
  "TODO: Describe what this skill does and when an agent should use it.";

function titleFromName(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function createSkill(root, name) {
  if (!isValidSkillName(name)) {
    throw new Error(
      "Skill name must be under 64 characters and use lowercase letters, numbers, and single hyphens.",
    );
  }

  const templatePath = path.join(
    root,
    "templates",
    "skill",
    "SKILL.md.template",
  );
  const skillDirectory = path.join(root, "skills", name);
  const skillPath = path.join(skillDirectory, "SKILL.md");
  const template = await readFile(templatePath, "utf8");
  const content = template
    .replaceAll("{{SKILL_NAME}}", name)
    .replaceAll("{{SKILL_TITLE}}", titleFromName(name))
    .replaceAll("{{SKILL_DESCRIPTION}}", PLACEHOLDER_DESCRIPTION);

  await mkdir(skillDirectory);
  await writeFile(skillPath, content, { encoding: "utf8", flag: "wx" });

  return skillPath;
}

async function main() {
  const [, , name, ...extraArguments] = process.argv;

  if (!name || extraArguments.length > 0) {
    console.error("Usage: npm run new:skill -- <skill-name>");
    process.exitCode = 1;
    return;
  }

  try {
    const skillPath = await createSkill(process.cwd(), name);
    console.log(`Created ${path.relative(process.cwd(), skillPath)}`);
    console.log("Replace the TODO description and skill-specific workflow.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  await main();
}
