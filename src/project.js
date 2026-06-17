import fs from "node:fs";
import path from "node:path";
import { projectRoot, writeFileIfAllowed } from "./fs.js";

const scaffold = [
  ["osa/AGENTS.md", "# OSA Project Instructions\n\nKeep always-needed operating context here.\n"],
  [
    "osa/agent.yml",
    "name: osa-agent\ndescription: Filesystem-defined OSA agent operating environment.\nruntime:\n  target: local\n",
  ],
  [
    "osa/instructions.md",
    "You are an OSA agent. Inspect context, use tools carefully, and report uncertainty.\n",
  ],
  [
    "osa/permissions.yml",
    "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\nsecrets:\n  allow: []\n",
  ],
  [
    "osa/computers/default.yml",
    "enabled: false\nkind: miosa-computer\nsize: standard\ncapabilities:\n  browser: true\n  screenshot: true\n  shell: true\n  desktop: true\n",
  ],
  ["osa/connections/.gitkeep", ""],
  ["osa/channels/.gitkeep", ""],
  ["osa/docs/README.md", "# OSA Project Docs\n\nReference material for this agent.\n"],
  ["osa/evals/smoke.yml", "name: smoke\nprompt: Summarize this OSA project.\nchecks:\n  - completed\n"],
  [
    "osa/skills/getting-started/SKILL.md",
    "---\nname: getting-started\ndescription: Use when explaining the OSA project layout.\ntrust: local\n---\n\nExplain the OSA project layout and recommend `osa info`.\n",
  ],
  ["osa/subagents/.gitkeep", ""],
  ["osa/tools/.gitkeep", ""],
];

export function initProject(target = ".", options = {}) {
  const root = projectRoot(target);
  fs.mkdirSync(root, { recursive: true });
  const results = scaffold.map(([file, content]) => writeFileIfAllowed(root, file, content, options));
  const written = results.filter((item) => item.written).map((item) => item.path);
  const skipped = results.filter((item) => !item.written).map((item) => item.path);
  if (written.length === 0 && skipped.length > 0 && !options.force) {
    const err = new Error("OSA project files already exist. Pass --force to overwrite scaffold files.");
    err.code = "OSA_PROJECT_EXISTS";
    throw err;
  }
  return { projectRoot: root, written, skipped };
}

export function findProjectRoot(start = process.cwd()) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, "osa"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}
