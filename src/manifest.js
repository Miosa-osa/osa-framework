import fs from "node:fs";
import path from "node:path";
import { artifactRoot, listFiles, osaRoot, projectRoot, rel } from "./fs.js";
import { parseSimpleYaml } from "./simple-yaml.js";
import { listSkills } from "./skills.js";

export function inspectProject(target = ".") {
  const root = projectRoot(target);
  const osa = osaRoot(root);
  const diagnostics = [];
  if (!fs.existsSync(osa)) {
    diagnostics.push({ severity: "error", code: "osa.root.missing", message: "No osa/ directory found.", path: "osa" });
  }

  const agentPath = path.join(osa, "agent.yml");
  const agent = fs.existsSync(agentPath) ? parseSimpleYaml(fs.readFileSync(agentPath, "utf8")) : {};
  if (!fs.existsSync(agentPath)) {
    diagnostics.push({ severity: "warning", code: "agent.config.missing", message: "osa/agent.yml is missing.", path: "osa/agent.yml" });
  }

  const instructionsPath = path.join(osa, "instructions.md");
  if (!fs.existsSync(instructionsPath)) {
    diagnostics.push({ severity: "warning", code: "instructions.missing", message: "osa/instructions.md is missing.", path: "osa/instructions.md" });
  }

  const computers = yamlDir(path.join(osa, "computers"), root).map((item) => ({
    name: item.name,
    path: item.path,
    enabled: item.data.enabled === true,
    kind: item.data.kind,
  }));

  const connections = yamlDir(path.join(osa, "connections"), root).map((item) => ({
    name: item.name,
    path: item.path,
    type: item.data.type ?? "unknown",
    description: item.data.description ?? "",
    hasAuth: Boolean(item.data.auth && Object.keys(item.data.auth).length > 0),
  }));

  const manifest = {
    version: 1,
    projectRoot: root,
    osaRoot: osa,
    agent: {
      name: agent.name ?? path.basename(root),
      description: agent.description,
    },
    context: {
      agentsMd: fs.existsSync(path.join(osa, "AGENTS.md")) ? "osa/AGENTS.md" : undefined,
      instructions: fs.existsSync(instructionsPath) ? ["osa/instructions.md"] : [],
      docs: listFiles(path.join(osa, "docs"), root),
    },
    skills: listSkills(root),
    connections,
    computers,
    evals: listFiles(path.join(osa, "evals"), root),
    diagnostics: {
      errors: diagnostics.filter((item) => item.severity === "error").length,
      warnings: diagnostics.filter((item) => item.severity === "warning").length,
    },
  };

  return { manifest, diagnostics };
}

export function writeArtifacts(target = ".") {
  const root = projectRoot(target);
  const result = inspectProject(root);
  const out = artifactRoot(root);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "osa-manifest.json"), JSON.stringify(result.manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(out, "osa-diagnostics.json"), JSON.stringify({ version: 1, items: result.diagnostics }, null, 2) + "\n");
  return result;
}

function yamlDir(dir, root) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => {
      const full = path.join(dir, entry.name);
      return {
        name: entry.name.replace(/\.ya?ml$/, ""),
        path: rel(root, full),
        data: parseSimpleYaml(fs.readFileSync(full, "utf8")),
      };
    });
}
