import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

export function docsPath() {
  return path.join(root, "docs");
}

export function listDocs() {
  const docs = docsPath();
  if (!fs.existsSync(docs)) return [];
  return fs
    .readdirSync(docs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join("docs", entry.name));
}
