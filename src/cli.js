#!/usr/bin/env node
import { initProject } from "./project.js";
import { inspectProject, writeArtifacts } from "./manifest.js";
import { buildProject } from "./build.js";

const [, , command = "help", ...args] = process.argv;

try {
  if (command === "init") {
    const target = args[0] ?? ".";
    const result = initProject(target, { force: args.includes("--force") });
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
  } else {
    console.log(`osa

Commands:
  osa init [target]
  osa info [target]
  osa build [target]
  osa skills [target]
`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}
