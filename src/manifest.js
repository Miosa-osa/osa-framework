import fs from "node:fs";
import path from "node:path";
import { artifactRoot, listFiles, projectRoot, projectSpecRoot, projectSpecRootName, rel } from "./fs.js";
import { parseSimpleYaml } from "./simple-yaml.js";
import { listSkills } from "./skills.js";

export function inspectProject(target = ".") {
  const root = projectRoot(target);
  const osa = projectSpecRoot(root);
  const rootName = projectSpecRootName(root);
  const diagnostics = [];
  if (!fs.existsSync(osa)) {
    diagnostics.push({ severity: "error", code: "agent.root.missing", message: "No agent/ or osa/ directory found.", path: "agent" });
  }

  const packageName = readPackageName(root);
  const legacyAgentPath = path.join(osa, "agent.yml");
  const agentConfigPath = firstExistingPath([path.join(osa, "agent.ts"), path.join(osa, "agent.js"), legacyAgentPath]);
  const agent = readAgentMetadata(agentConfigPath, legacyAgentPath);

  const instructionsPath = path.join(osa, "instructions.md");
  if (!fs.existsSync(instructionsPath)) {
    diagnostics.push({ severity: "warning", code: "instructions.missing", message: `${rootName}/instructions.md is missing.`, path: `${rootName}/instructions.md` });
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

  const channels = yamlDir(path.join(osa, "channels"), root).map((item) => ({
    name: item.name,
    path: item.path,
    type: item.data.type ?? "unknown",
    description: item.data.description ?? "",
    entrypoint: item.data.entrypoint,
  }));

  const schedules = yamlDir(path.join(osa, "schedules"), root).map((item) => ({
    name: item.data.name ?? item.name,
    path: item.path,
    cron: item.data.cron,
    prompt: item.data.prompt,
  }));

  const subagents = subagentDir(path.join(osa, "subagents"), root);
  const tools = listFiles(path.join(osa, "tools"), root).filter((file) => /\.(mjs|js|ts)$/.test(file));
  const evals = [...listFiles(path.join(root, "evals"), root), ...listFiles(path.join(osa, "evals"), root)];

  const manifest = {
    version: 1,
    projectRoot: root,
    sourceRoot: rootName,
    osaRoot: osa,
    agent: {
      name: agent.name ?? packageName ?? path.basename(root),
      description: agent.description,
      config: agentConfigPath ? rel(root, agentConfigPath) : undefined,
    },
    context: {
      agentsMd: fs.existsSync(path.join(osa, "AGENTS.md")) ? `${rootName}/AGENTS.md` : undefined,
      instructions: fs.existsSync(instructionsPath) ? [`${rootName}/instructions.md`] : [],
      docs: listFiles(path.join(osa, "docs"), root),
    },
    skills: listSkills(root),
    tools,
    subagents,
    channels,
    schedules,
    connections,
    computers,
    evals: Array.from(new Set(evals)),
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

function subagentDir(dir, root) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const subagentRoot = path.join(dir, entry.name);
      const legacyAgentPath = path.join(subagentRoot, "agent.yml");
      const agentPath = firstExistingPath([path.join(subagentRoot, "agent.ts"), path.join(subagentRoot, "agent.js"), legacyAgentPath]);
      const instructionsPath = path.join(dir, entry.name, "instructions.md");
      const data = readAgentMetadata(agentPath, legacyAgentPath);
      return {
        name: data.name ?? entry.name,
        path: rel(root, path.join(dir, entry.name)),
        description: data.description ?? "",
        model: data.model,
        config: agentPath ? rel(root, agentPath) : undefined,
        instructions: fs.existsSync(instructionsPath) ? rel(root, instructionsPath) : undefined,
      };
    });
}

function firstExistingPath(paths) {
  return paths.find((filePath) => fs.existsSync(filePath));
}

function readPackageName(root) {
  const packagePath = path.join(root, "package.json");
  if (!fs.existsSync(packagePath)) return undefined;
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    return typeof pkg.name === "string" && pkg.name ? pkg.name : undefined;
  } catch {
    return undefined;
  }
}

function readAgentMetadata(agentPath, legacyAgentPath) {
  if (legacyAgentPath && fs.existsSync(legacyAgentPath)) {
    return parseSimpleYaml(fs.readFileSync(legacyAgentPath, "utf8"));
  }
  if (!agentPath || !fs.existsSync(agentPath) || !/\.[cm]?[jt]s$/.test(agentPath)) return {};
  const source = fs.readFileSync(agentPath, "utf8");
  return {
    description: readStringProperty(source, "description"),
    model: readStringProperty(source, "model"),
  };
}

function readStringProperty(source, property) {
  const pattern = new RegExp(`${property}:\\s*["']([^"']+)["']`);
  return pattern.exec(source)?.[1];
}
