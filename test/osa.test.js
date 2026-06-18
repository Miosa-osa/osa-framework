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
  assert.deepEqual(result.written, ["agent/instructions.md"]);
  assert.equal(result.template, "standard");

  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.sourceRoot, "agent");
  assert.deepEqual(inspected.manifest.context.instructions, ["agent/instructions.md"]);
  assert.equal(inspected.manifest.agent.name, path.basename(root));
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
      assert.deepEqual(result.written, ["agent/instructions.md"]);
      assert.equal(inspected.manifest.skills.length, 0);
      assert.equal(inspected.manifest.tools.length, 0);
    } else {
      assert.equal(inspected.manifest.sourceRoot, "agent");
      assert.equal(inspected.manifest.agent.config, "agent/agent.ts");
      assert.ok(inspected.manifest.runtimeProfile);
      assert.ok(result.written.includes("agent/agent.ts"));
      assert.ok(result.written.some((file) => file.startsWith("evals/")));
      assert.ok(inspected.manifest.skills.length > 0);
      assert.ok(inspected.manifest.tools.length > 0);
      assert.ok(inspected.manifest.evals.length > 0);
    }
  }
});

test("keeps default as a standard alias", () => {
  const root = tmp();
  const result = initProject(root, { template: "default" });
  assert.equal(result.template, "default");
  assert.deepEqual(result.written, ["agent/instructions.md"]);
  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.tools.length, 0);
  assert.equal(inspected.manifest.subagents.length, 0);
});

test("inspects a hand-written one-file agent layout", () => {
  const root = tmp();
  fs.mkdirSync(path.join(root, "agent"), { recursive: true });
  fs.writeFileSync(path.join(root, "agent", "instructions.md"), "Review invoices and ask before sending email.\n");

  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.sourceRoot, "agent");
  assert.equal(inspected.manifest.diagnostics.errors, 0);
  assert.equal(inspected.manifest.context.instructions[0], "agent/instructions.md");

  const build = buildProject(root);
  assert.equal(build.errors, 0);
});

test("keeps legacy osa layout compatibility", () => {
  const root = tmp();
  fs.mkdirSync(path.join(root, "osa"), { recursive: true });
  fs.writeFileSync(path.join(root, "osa", "instructions.md"), "Legacy project instructions.\n");

  const inspected = inspectProject(root);
  assert.equal(inspected.manifest.sourceRoot, "osa");
  assert.equal(inspected.manifest.diagnostics.errors, 0);
  assert.equal(inspected.manifest.context.instructions[0], "osa/instructions.md");
});

test("lists bundled docs", () => {
  const docs = listDocs();
  assert.equal(docs.includes("docs/getting-started.md"), true);
  assert.equal(docs.includes("docs/eve-comparison.md"), true);
});

test("builds launch examples", () => {
  for (const example of [
    "minimal-agent",
    "standard-agent",
    "clinic-ops-agent",
    "browser-qa-agent",
    "repo-maintainer-agent",
    "deployment-operator-agent",
  ]) {
    const root = path.resolve("examples", example);
    const inspected = inspectProject(root);
    assert.equal(inspected.manifest.diagnostics.errors, 0);
    if (example === "minimal-agent") {
      assert.equal(inspected.manifest.sourceRoot, "agent");
      assert.equal(inspected.manifest.tools.length, 0);
      assert.equal(inspected.manifest.evals.length, 0);
    } else if (example === "standard-agent") {
      assert.equal(inspected.manifest.sourceRoot, "agent");
      assert.equal(inspected.manifest.agent.config, "agent/agent.ts");
      assert.equal(inspected.manifest.agent.model, "openai/gpt-5.4-mini");
      assert.deepEqual(inspected.manifest.runtimeProfile.model.fallback, ["anthropic/claude-sonnet-4.6"]);
      assert.equal(inspected.manifest.runtimeProfile.harness.engine, "auto");
      assert.equal(inspected.manifest.runtimeProfile.runtime.durability, "checkpointed");
      assert.equal(inspected.manifest.runtimeProfile.sandbox.backend, "miosa-sandbox");
      assert.equal(inspected.manifest.skills.length, 1);
      assert.equal(inspected.manifest.tools[0], "agent/tools/get_weather.ts");
      assert.equal(inspected.manifest.channels[0].path, "agent/channels/slack.ts");
      assert.equal(inspected.manifest.connections[0].path, "agent/connections/linear.ts");
      assert.equal(inspected.manifest.schedules[0].path, "agent/schedules/daily-report.md");
      assert.equal(inspected.manifest.subagents[0].config, "agent/subagents/researcher/agent.ts");
      assert.equal(inspected.manifest.hooks[0], "agent/hooks/session-start.ts");
      assert.equal(inspected.manifest.sandbox.config, "agent/sandbox/sandbox.ts");
      assert.deepEqual(inspected.manifest.sandbox.workspace, ["agent/sandbox/workspace/saved-cities.json"]);
      assert.equal(inspected.manifest.evals[0], "evals/weather-digest.yml");
    } else {
      assert.equal(inspected.manifest.sourceRoot, "agent");
      assert.equal(inspected.manifest.agent.config, "agent/agent.ts");
      assert.ok(inspected.manifest.tools.length > 0);
      assert.ok(inspected.manifest.evals.length > 0);
      assert.ok(inspected.manifest.evals.every((file) => file.startsWith("evals/")));
    }

    const build = buildProject(root);
    assert.equal(build.errors, 0);
    assert.ok(fs.existsSync(path.join(root, ".miosa", "osa-manifest.json")));
    fs.rmSync(path.join(root, ".miosa"), { recursive: true, force: true });
  }
});
