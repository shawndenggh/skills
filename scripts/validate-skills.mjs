import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_NAME_LENGTH = 63;
const MAX_DESCRIPTION_LENGTH = 1_024;
const MAX_SKILL_LINES = 500;
const IGNORED_DIRECTORIES = new Set([".git", "node_modules"]);
const PLACEHOLDER_PATTERN =
  /\{\{[^}]+\}\}|todo\b|describe what this skill|skill-specific workflow/i;

export function isValidSkillName(name) {
  return (
    typeof name === "string" &&
    name.length > 0 &&
    name.length <= MAX_NAME_LENGTH &&
    SKILL_NAME_PATTERN.test(name)
  );
}

function decodeScalar(value, field, errors, relativePath) {
  const trimmed = value.trim();

  if (!trimmed) {
    errors.push(`${relativePath}: ${field} must not be empty`);
    return "";
  }

  if (trimmed === "|" || trimmed === ">") {
    errors.push(
      `${relativePath}: ${field} must use a portable single-line scalar`,
    );
    return "";
  }

  if (trimmed.startsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      errors.push(`${relativePath}: ${field} has invalid double-quoted syntax`);
      return "";
    }
  }

  if (trimmed.startsWith("'")) {
    if (!trimmed.endsWith("'") || trimmed.length === 1) {
      errors.push(`${relativePath}: ${field} has invalid single-quoted syntax`);
      return "";
    }
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }

  return trimmed;
}

export function parseSkill(content, relativePath = "SKILL.md") {
  const errors = [];
  const normalizedContent = content.replaceAll("\r\n", "\n");
  const lines = normalizedContent.split("\n");
  const lineCount =
    normalizedContent.endsWith("\n") && lines.length > 1
      ? lines.length - 1
      : lines.length;

  if (lines[0]?.trim() !== "---") {
    return {
      errors: [`${relativePath}: frontmatter must start on the first line`],
      fields: {},
      body: "",
      lineCount,
    };
  }

  const frontmatterEnd = lines.findIndex(
    (line, index) => index > 0 && line.trim() === "---",
  );
  if (frontmatterEnd === -1) {
    return {
      errors: [`${relativePath}: frontmatter is missing its closing delimiter`],
      fields: {},
      body: "",
      lineCount,
    };
  }

  const fields = {};
  for (const line of lines.slice(1, frontmatterEnd)) {
    if (!line.trim()) {
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      errors.push(
        `${relativePath}: frontmatter entries must be top-level key/value pairs`,
      );
      continue;
    }

    const [, key, rawValue] = match;
    if (!["name", "description"].includes(key)) {
      errors.push(
        `${relativePath}: unsupported frontmatter field "${key}"; use only name and description`,
      );
      continue;
    }
    if (Object.hasOwn(fields, key)) {
      errors.push(`${relativePath}: duplicate frontmatter field "${key}"`);
      continue;
    }

    fields[key] = decodeScalar(rawValue, key, errors, relativePath);
  }

  for (const requiredField of ["name", "description"]) {
    if (!Object.hasOwn(fields, requiredField)) {
      errors.push(
        `${relativePath}: missing required frontmatter field "${requiredField}"`,
      );
    }
  }

  return {
    errors,
    fields,
    body: lines
      .slice(frontmatterEnd + 1)
      .join("\n")
      .trim(),
    lineCount,
  };
}

async function findSkillFiles(root) {
  const skillFiles = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile() && entry.name === "SKILL.md") {
        skillFiles.push(entryPath);
      }
    }
  }

  await visit(root);
  return skillFiles.sort();
}

async function validateTemplate(root, errors) {
  const templatePath = path.join(
    root,
    "templates",
    "skill",
    "SKILL.md.template",
  );

  try {
    const template = await readFile(templatePath, "utf8");
    for (const placeholder of [
      "{{SKILL_NAME}}",
      "{{SKILL_DESCRIPTION}}",
      "{{SKILL_TITLE}}",
    ]) {
      if (!template.includes(placeholder)) {
        errors.push(
          `templates/skill/SKILL.md.template: missing ${placeholder}`,
        );
      }
    }
  } catch {
    errors.push("templates/skill/SKILL.md.template: template is missing");
  }
}

export async function validateRepository(root) {
  const absoluteRoot = path.resolve(root);
  const errors = [];
  const skills = [];
  const names = new Map();

  await validateTemplate(absoluteRoot, errors);

  const skillFiles = await findSkillFiles(absoluteRoot);
  for (const skillFile of skillFiles) {
    const relativePath = path.relative(absoluteRoot, skillFile);
    const pathParts = relativePath.split(path.sep);
    const isPublishedSkill =
      pathParts.length === 3 &&
      pathParts[0] === "skills" &&
      pathParts[2] === "SKILL.md";

    if (!isPublishedSkill) {
      errors.push(
        `${relativePath}: publishable SKILL.md files must live directly under skills/<skill-name>/`,
      );
      continue;
    }

    const directoryName = pathParts[1];
    if (!isValidSkillName(directoryName)) {
      errors.push(
        `${relativePath}: directory name must be under 64 characters and use lowercase letters, numbers, and single hyphens`,
      );
    }
    const content = await readFile(skillFile, "utf8");
    const parsed = parseSkill(content, relativePath);
    errors.push(...parsed.errors);

    const { name, description } = parsed.fields;
    if (name !== undefined) {
      if (!isValidSkillName(name)) {
        errors.push(
          `${relativePath}: name must be under 64 characters and use lowercase letters, numbers, and single hyphens`,
        );
      }
      if (name !== directoryName) {
        errors.push(
          `${relativePath}: frontmatter name "${name}" must match directory "${directoryName}"`,
        );
      }
      if (names.has(name)) {
        errors.push(
          `${relativePath}: duplicate skill name "${name}" also used by ${names.get(name)}`,
        );
      } else {
        names.set(name, relativePath);
      }
    }

    if (description !== undefined) {
      if (description.length > MAX_DESCRIPTION_LENGTH) {
        errors.push(
          `${relativePath}: description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
        );
      }
      if (PLACEHOLDER_PATTERN.test(description)) {
        errors.push(`${relativePath}: replace the placeholder description`);
      }
    }

    if (!parsed.body) {
      errors.push(`${relativePath}: skill instructions must not be empty`);
    } else if (PLACEHOLDER_PATTERN.test(parsed.body)) {
      errors.push(`${relativePath}: replace placeholder instructions`);
    }

    if (parsed.lineCount > MAX_SKILL_LINES) {
      errors.push(
        `${relativePath}: keep SKILL.md at or below ${MAX_SKILL_LINES} lines`,
      );
    }

    skills.push({ name, directoryName, relativePath });
  }

  const skillsDirectory = path.join(absoluteRoot, "skills");
  const entries = await readdir(skillsDirectory, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      !skillFiles.includes(path.join(skillsDirectory, entry.name, "SKILL.md"))
    ) {
      errors.push(`skills/${entry.name}: skill directory is missing SKILL.md`);
    }
  }

  const readmePath = path.join(absoluteRoot, "README.md");
  try {
    const readme = await readFile(readmePath, "utf8");
    if (skills.length === 0 && !readme.includes("_No published skills yet._")) {
      errors.push(
        "README.md: empty repositories must state _No published skills yet._",
      );
    }
    for (const skill of skills) {
      const expectedLink = `skills/${skill.directoryName}/`;
      if (!readme.includes(expectedLink)) {
        errors.push(
          `README.md: add "${skill.name}" with a link to ${expectedLink}`,
        );
      }
    }
  } catch {
    errors.push("README.md: file is missing");
  }

  return { errors, skills };
}

async function main() {
  try {
    const { errors, skills } = await validateRepository(process.cwd());
    if (errors.length > 0) {
      console.error(`Validation failed with ${errors.length} error(s):`);
      for (const error of errors) {
        console.error(`- ${error}`);
      }
      process.exitCode = 1;
      return;
    }

    const label = skills.length === 1 ? "skill" : "skills";
    console.log(`Validation passed: ${skills.length} published ${label}.`);
  } catch (error) {
    console.error(`Validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  await main();
}
