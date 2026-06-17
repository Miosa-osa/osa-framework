#!/usr/bin/env node
import { initProject } from "./project.js";
import { inspectProject, writeArtifacts } from "./manifest.js";
import { buildProject } from "./build.js";
import { docsPath, listDocs } from "./docs.js";
import { listTemplates } from "./templates.js";

const [, , command = "help", ...args] = process.argv;

try {
  if (command === "init") {
    const target = firstPositional(args) ?? ".";
    const result = initProject(target, { force: args.includes("--force"), template: optionValue(args, "--template") ?? "standard" });
    print(result);
  } else if (command === "info") {
    const target = args[0] && !args[0].startsWith("--") ? args[0] : ".";
    const result = writeArtifacts(target);
    print(result);
    if (result.manifest.diagnostics.errors > 0) process.exitCode = 1;
  } else if (command === "build") {
    const target = args[0] && !args[0].startsWith("--") ? args[0] : ".";
    print(buildProject(target));
  } else if (command === "skills") {
    const target = args[0] && !args[0].startsWith("--") ? args[0] : ".";
    print(inspectProject(target).manifest.skills);
  } else if (command === "docs") {
    print({ docsPath: docsPath(), docs: listDocs() });
  } else if (command === "templates") {
    print(listTemplates());
  } else {
    console.log(`osa

Commands:
  osa init [target] [--template <name>]
  osa info [target]
  osa build [target]
  osa skills [target]
  osa docs
  osa templates
`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function firstPositional(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") continue;
    if (arg === "--template") {
      index += 1;
      continue;
    }
    if (!arg.startsWith("--")) return arg;
  }
  return undefined;
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}
