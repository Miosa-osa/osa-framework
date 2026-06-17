import fs from "node:fs";
import path from "node:path";
import { osaRoot, rel } from "./fs.js";

export function listSkills(projectRoot) {
  const dir = path.join(osaRoot(projectRoot), "skills");
  if (!fs.existsSync(dir)) return [];
  const skills = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".md")) {
      const source = fs.readFileSync(full, "utf8");
      skills.push({
        name: entry.name.replace(/\.md$/, ""),
        path: rel(projectRoot, full),
        source: "project",
        trust: "local",
        description: firstLine(source),
      });
    }
    if (entry.isDirectory()) {
      const skillPath = path.join(full, "SKILL.md");
      if (!fs.existsSync(skillPath)) continue;
      const source = fs.readFileSync(skillPath, "utf8");
      const frontmatter = parseFrontmatter(source);
      skills.push({
        name: frontmatter.name ?? entry.name,
        path: rel(projectRoot, skillPath),
        source: "project",
        trust: frontmatter.trust ?? "local",
        description: frontmatter.description ?? firstLine(source),
      });
    }
  }

  return skills;
}

function firstLine(source) {
  return (
    source
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/^[#>*-]\s*/, ""))
      .find((line) => line && line !== "---" && !line.includes(":")) ?? ""
  );
}

function parseFrontmatter(source) {
  if (!source.startsWith("---")) return {};
  const end = source.indexOf("\n---", 3);
  if (end === -1) return {};
  const result = {};
  for (const line of source.slice(3, end).split(/\r?\n/)) {
    const match = /^([^:]+):\s*(.*)$/.exec(line.trim());
    if (match) result[match[1].trim()] = match[2].trim();
  }
  return result;
}
