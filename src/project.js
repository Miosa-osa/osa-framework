import fs from "node:fs";
import path from "node:path";
import { projectRoot, writeFileIfAllowed } from "./fs.js";
import { getTemplateScaffold } from "./templates.js";

export function initProject(target = ".", options = {}) {
  const root = projectRoot(target);
  const template = options.template ?? "standard";
  const scaffold = getTemplateScaffold(template);
  fs.mkdirSync(root, { recursive: true });
  const results = scaffold.map(([file, content]) => writeFileIfAllowed(root, file, content, options));
  const written = results.filter((item) => item.written).map((item) => item.path);
  const skipped = results.filter((item) => !item.written).map((item) => item.path);
  if (written.length === 0 && skipped.length > 0 && !options.force) {
    const err = new Error("OSA project files already exist. Pass --force to overwrite scaffold files.");
    err.code = "OSA_PROJECT_EXISTS";
    throw err;
  }
  return { projectRoot: root, template, written, skipped };
}

export function findProjectRoot(start = process.cwd()) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, "agent")) || fs.existsSync(path.join(current, "osa"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}
