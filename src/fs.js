import fs from "node:fs";
import path from "node:path";

export function projectRoot(target = ".") {
  return path.resolve(process.cwd(), target);
}

export function osaRoot(root) {
  return path.join(root, "osa");
}

export function agentRoot(root) {
  return path.join(root, "agent");
}

export function projectSpecRoot(root) {
  const osa = osaRoot(root);
  const agent = agentRoot(root);
  if (fs.existsSync(agent)) return agent;
  if (fs.existsSync(osa)) return osa;
  return agent;
}

export function projectSpecRootName(root) {
  return path.basename(projectSpecRoot(root));
}

export function artifactRoot(root) {
  return path.join(root, ".miosa");
}

export function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

export function rel(root, filePath) {
  const value = path.relative(root, filePath);
  return value ? toPosix(value) : ".";
}

export function listFiles(dir, root) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === ".gitkeep") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(full, root));
    } else if (entry.isFile()) {
      files.push(rel(root, full));
    }
  }
  return files;
}

export function writeFileIfAllowed(root, relativePath, content, { force = false } = {}) {
  const full = path.join(root, relativePath);
  if (fs.existsSync(full) && !force) {
    return { path: relativePath, written: false };
  }
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  return { path: relativePath, written: true };
}
