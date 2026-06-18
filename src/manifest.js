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

  const connections = [
    ...yamlDir(path.join(osa, "connections"), root).map((item) => ({
      name: item.name,
      path: item.path,
      type: item.data.type ?? "unknown",
      description: item.data.description ?? "",
      hasAuth: Boolean(item.data.auth && Object.keys(item.data.auth).length > 0),
    })),
    ...moduleDir(path.join(osa, "connections"), root).map((item) => ({
      name: item.name,
      path: item.path,
      type: "module",
      description: readStringProperty(fs.readFileSync(path.join(root, item.path), "utf8"), "description") ?? "",
      hasAuth: true,
    })),
  ];

  const channels = [
    ...yamlDir(path.join(osa, "channels"), root).map((item) => ({
      name: item.name,
      path: item.path,
      type: item.data.type ?? "unknown",
      description: item.data.description ?? "",
      entrypoint: item.data.entrypoint,
    })),
    ...moduleDir(path.join(osa, "channels"), root).map((item) => ({
      name: item.name,
      path: item.path,
      type: "module",
      description: readStringProperty(fs.readFileSync(path.join(root, item.path), "utf8"), "description") ?? "",
    })),
  ];

  const schedules = [
    ...yamlDir(path.join(osa, "schedules"), root).map((item) => ({
      name: item.data.name ?? item.name,
      path: item.path,
      cron: item.data.cron,
      prompt: item.data.prompt,
    })),
    ...markdownDir(path.join(osa, "schedules"), root).map((item) => ({
      name: item.name,
      path: item.path,
      cron: item.frontmatter.cron,
      prompt: item.body.trim(),
    })),
    ...moduleDir(path.join(osa, "schedules"), root).map((item) => ({
      name: item.name,
      path: item.path,
      cron: readStringProperty(fs.readFileSync(path.join(root, item.path), "utf8"), "cron"),
    })),
  ];

  const subagents = subagentDir(path.join(osa, "subagents"), root);
  const tools = moduleDir(path.join(osa, "tools"), root).map((item) => item.path);
  const evals = [...listFiles(path.join(root, "evals"), root), ...listFiles(path.join(osa, "evals"), root)];
  const sandboxConfigPath = firstExistingPath([
    path.join(osa, "sandbox.ts"),
    path.join(osa, "sandbox.js"),
    path.join(osa, "sandbox", "sandbox.ts"),
    path.join(osa, "sandbox", "sandbox.js"),
  ]);

  const manifest = {
    version: 1,
    projectRoot: root,
    sourceRoot: rootName,
    osaRoot: osa,
    agent: {
      name: agent.name ?? packageName ?? path.basename(root),
      description: agent.description,
      model: agentModelName(agent.runtimeProfile),
      config: agentConfigPath ? rel(root, agentConfigPath) : undefined,
    },
    runtimeProfile: agent.runtimeProfile ?? {},
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
    hooks: moduleDir(path.join(osa, "hooks"), root).map((item) => item.path),
    sandbox: {
      config: sandboxConfigPath ? rel(root, sandboxConfigPath) : undefined,
      workspace: listFiles(path.join(osa, "sandbox", "workspace"), root),
    },
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

function markdownDir(dir, root) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.md$/.test(entry.name))
    .map((entry) => {
      const full = path.join(dir, entry.name);
      const parsed = parseMarkdownFrontmatter(fs.readFileSync(full, "utf8"));
      return {
        name: entry.name.replace(/\.md$/, ""),
        path: rel(root, full),
        ...parsed,
      };
    });
}

function moduleDir(dir, root) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(mjs|js|ts)$/.test(entry.name))
    .map((entry) => {
      const full = path.join(dir, entry.name);
      return {
        name: entry.name.replace(/\.(mjs|js|ts)$/, ""),
        path: rel(root, full),
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
        model: agentModelName(data.runtimeProfile),
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
    const config = parseSimpleYaml(fs.readFileSync(legacyAgentPath, "utf8"));
    return {
      ...config,
      runtimeProfile: legacyRuntimeProfile(config),
    };
  }
  if (!agentPath || !fs.existsSync(agentPath) || !/\.[cm]?[jt]s$/.test(agentPath)) return {};
  const source = fs.readFileSync(agentPath, "utf8");
  return {
    description: readStringProperty(source, "description"),
    runtimeProfile: readRuntimeProfile(source),
  };
}

function readStringProperty(source, property) {
  const pattern = new RegExp(`${property}:\\s*["']([^"']+)["']`);
  return pattern.exec(source)?.[1];
}

function readRuntimeProfile(source) {
  const model = readModelConfig(source);
  const harness = readObjectConfig(source, "harness");
  const runtime = readObjectConfig(source, "runtime");
  const sandbox = readObjectConfig(source, "sandbox");
  const policy = readObjectConfig(source, "policy");
  const capabilities = readObjectConfig(source, "capabilities");
  const provider = readStringProperty(source, "provider") ?? stringField(harness, "engine");

  return compactRecord({
    ...(model !== undefined ? { model } : {}),
    ...(provider ? { provider } : {}),
    ...(harness ? { harness } : {}),
    ...(runtime ? { runtime } : {}),
    ...(sandbox ? { sandbox } : {}),
    ...(policy ? { policy } : {}),
    ...(capabilities ? { capabilities } : {}),
  });
}

function legacyRuntimeProfile(config) {
  return compactRecord({
    ...(typeof config.model === "string" ? { model: config.model } : {}),
    ...(typeof config.provider === "string" ? { provider: config.provider } : {}),
    ...(isPlainRecord(config.runtime) ? { runtime: config.runtime } : {}),
    ...(isPlainRecord(config.sandbox) ? { sandbox: config.sandbox } : {}),
  });
}

function readModelConfig(source) {
  const block = readObjectBlock(source, "model");
  if (!block) return readStringProperty(source, "model");
  return compactRecord({
    ...(readStringProperty(block, "primary") ? { primary: readStringProperty(block, "primary") } : {}),
    ...(readStringProperty(block, "id") ? { id: readStringProperty(block, "id") } : {}),
    ...(readStringProperty(block, "default") ? { default: readStringProperty(block, "default") } : {}),
    ...(readStringArrayInBlock(block, "fallback") ? { fallback: readStringArrayInBlock(block, "fallback") } : {}),
  });
}

function readObjectConfig(source, property) {
  const block = readObjectBlock(source, property);
  if (!block) return undefined;
  const record = {};
  for (const key of ["engine", "mode", "target", "durability", "isolation", "backend", "network", "profile"]) {
    const value = readStringProperty(block, key);
    if (value) record[key] = value;
  }
  for (const key of ["durable", "checkpointing", "streaming", "codeEditing", "shell", "browser", "github"]) {
    const value = readBooleanInBlock(block, key);
    if (value !== undefined) record[key] = value;
  }
  for (const key of ["allowed", "approvals", "required"]) {
    const value = readStringArrayInBlock(block, key);
    if (value) record[key] = value;
  }
  const resourcesBlock = readObjectBlock(block, "resources");
  if (resourcesBlock) {
    const resources = {};
    for (const key of ["cpu", "memoryGb", "diskGb", "gpu"]) {
      const number = readNumberInBlock(resourcesBlock, key);
      const string = readStringProperty(resourcesBlock, key);
      if (number !== undefined) resources[key] = number;
      else if (string) resources[key] = string;
    }
    if (Object.keys(resources).length > 0) record.resources = resources;
  }
  return Object.keys(record).length > 0 ? record : undefined;
}

function readObjectBlock(source, property) {
  const pattern = new RegExp(`${property}:\\s*\\{`);
  const match = pattern.exec(source);
  if (!match) return undefined;
  const open = source.indexOf("{", match.index);
  if (open === -1) return undefined;

  let depth = 0;
  let quote;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];
    if (quote) {
      if (char === quote && previous !== "\\") quote = undefined;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return undefined;
}

function readBooleanInBlock(block, property) {
  const pattern = new RegExp(`${property}:\\s*(true|false)\\b`);
  const value = pattern.exec(block)?.[1];
  return value === "true" ? true : value === "false" ? false : undefined;
}

function readNumberInBlock(block, property) {
  const pattern = new RegExp(`${property}:\\s*(\\d+(?:\\.\\d+)?)\\b`);
  const raw = pattern.exec(block)?.[1];
  return raw ? Number(raw) : undefined;
}

function readStringArrayInBlock(block, property) {
  const pattern = new RegExp(`${property}:\\s*\\[([^\\]]*)\\]`);
  const body = pattern.exec(block)?.[1];
  if (!body) return undefined;
  const quotedValue = new RegExp("[\"']([^\"']+)[\"']", "g");
  const values = Array.from(body.matchAll(quotedValue)).map((match) => match[1]).filter(Boolean);
  return values.length > 0 ? values : undefined;
}

function compactRecord(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => {
      if (value === undefined) return false;
      if (isPlainRecord(value)) return Object.keys(value).length > 0;
      return true;
    }),
  );
}

function isPlainRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringField(record, key) {
  return isPlainRecord(record) && typeof record[key] === "string" ? record[key] : undefined;
}

function agentModelName(profile) {
  if (!profile) return undefined;
  if (typeof profile.model === "string") return profile.model;
  return stringField(profile.model, "primary") ?? stringField(profile.model, "id") ?? stringField(profile.model, "default");
}

function parseMarkdownFrontmatter(source) {
  if (!source.startsWith("---")) return { frontmatter: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: {}, body: source };
  return {
    frontmatter: parseSimpleYaml(source.slice(3, end)),
    body: source.slice(end + 4).replace(/^\r?\n/, ""),
  };
}
