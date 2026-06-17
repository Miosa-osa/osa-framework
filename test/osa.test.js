import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initProject, inspectProject, buildProject, listDocs } from "../src/index.js";

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
  assert.equal(inspected.manifest.tools.includes("osa/tools/get_weather.ts"), true);
  assert.equal(inspected.manifest.channels[0].name, "web");
  assert.equal(inspected.manifest.schedules[0].name, "daily-summary");
  assert.equal(inspected.manifest.subagents[0].name, "investigator");
});

test("builds artifacts", () => {
  const root = tmp();
  initProject(root);
  const build = buildProject(root);
  assert.equal(build.errors, 0);
  assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-manifest.json")));
  assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-build.json")));
});

test("lists bundled docs", () => {
  const docs = listDocs();
  assert.equal(docs.includes("docs/getting-started.md"), true);
  assert.equal(docs.includes("docs/eve-comparison.md"), true);
});

test("builds launch examples", () => {
  for (const example of ["clinic-ops-agent", "browser-qa-agent"]) {
    const root = path.resolve("examples", example);
    const inspected = inspectProject(root);
    assert.equal(inspected.manifest.diagnostics.errors, 0);
    assert.ok(inspected.manifest.tools.length > 0);
    assert.ok(inspected.manifest.evals.length > 0);

    const build = buildProject(root);
    assert.equal(build.errors, 0);
    assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-manifest.json")));
    fs.rmSync(path.join(root, ".miosa"), { recursive: true, force: true });
  }
});
