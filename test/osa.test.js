import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initProject, inspectProject, buildProject } from "../src/index.js";

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "osa-framework-"));
}

test("initializes and inspects an OSA project", () => {
  const root = tmp();
  const result = initProject(root);
  assert.ok(result.written.includes("osa/AGENTS.md"));

  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.agent.name, "osa-agent");
  assert.equal(inspected.manifest.skills[0].name, "getting-started");
});

test("builds artifacts", () => {
  const root = tmp();
  initProject(root);
  const build = buildProject(root);
  assert.equal(build.errors, 0);
  assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-manifest.json")));
  assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-build.json")));
});
