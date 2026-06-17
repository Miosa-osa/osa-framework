import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initProject, inspectProject, buildProject, listDocs, listTemplates } from "../src/index.js";

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "osa-framework-"));
}

test("initializes and inspects an OSA project", () => {
  const root = tmp();
  const result = initProject(root);
  assert.ok(result.written.includes("osa/AGENTS.md"));
  assert.equal(result.template, "standard");

  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.agent.name, "osa-agent");
  assert.equal(inspected.manifest.skills.length, 0);
  assert.equal(inspected.manifest.tools.length, 0);
  assert.equal(inspected.manifest.channels.length, 0);
  assert.equal(inspected.manifest.schedules.length, 0);
  assert.equal(inspected.manifest.subagents.length, 0);
});

test("builds artifacts", () => {
  const root = tmp();
  initProject(root);
  const build = buildProject(root);
  assert.equal(build.errors, 0);
  assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-manifest.json")));
  assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-build.json")));
});

test("initializes named templates", () => {
  const templateNames = listTemplates().map((template) => template.name);
  assert.deepEqual(templateNames, ["standard", "full", "browser-qa", "clinic-ops", "repo-maintainer", "deployment-operator"]);

  for (const template of templateNames) {
    const root = tmp();
    const result = initProject(root, { template });
    assert.equal(result.template, template);
    const inspected = inspectProject(root);
    assert.equal(inspected.manifest.diagnostics.errors, 0);
    if (template === "standard") {
      assert.equal(inspected.manifest.skills.length, 0);
      assert.equal(inspected.manifest.tools.length, 0);
    } else {
      assert.ok(inspected.manifest.skills.length > 0);
      assert.ok(inspected.manifest.tools.length > 0);
    }
  }
});

test("keeps default as a standard alias", () => {
  const root = tmp();
  const result = initProject(root, { template: "default" });
  assert.equal(result.template, "default");
  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.tools.length, 0);
  assert.equal(inspected.manifest.subagents.length, 0);
});

test("lists bundled docs", () => {
  const docs = listDocs();
  assert.equal(docs.includes("docs/getting-started.md"), true);
  assert.equal(docs.includes("docs/eve-comparison.md"), true);
});

test("builds launch examples", () => {
  for (const example of [
    "clinic-ops-agent",
    "browser-qa-agent",
    "repo-maintainer-agent",
    "deployment-operator-agent",
  ]) {
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
