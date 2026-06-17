import fs from "node:fs";
import path from "node:path";
import { artifactRoot, projectRoot } from "./fs.js";
import { writeArtifacts } from "./manifest.js";

export function buildProject(target = ".") {
  const root = projectRoot(target);
  const result = writeArtifacts(root);
  if (result.manifest.diagnostics.errors > 0) {
    const err = new Error("OSA project has blocking diagnostics.");
    err.code = "OSA_BUILD_FAILED";
    err.diagnostics = result.diagnostics;
    throw err;
  }
  const build = {
    version: 1,
    builtAt: new Date().toISOString(),
    projectRoot: root,
    manifestPath: ".miosa/osa-manifest.json",
    diagnosticsPath: ".miosa/osa-diagnostics.json",
    errors: result.manifest.diagnostics.errors,
    warnings: result.manifest.diagnostics.warnings,
  };
  fs.writeFileSync(path.join(artifactRoot(root), "osa-build.json"), JSON.stringify(build, null, 2) + "\n");
  return build;
}
