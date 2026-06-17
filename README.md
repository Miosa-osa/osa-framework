# OSA Framework

[![CI](https://github.com/Miosa-osa/osa-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/Miosa-osa/osa-framework/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@miosa/osa.svg)](https://www.npmjs.com/package/@miosa/osa)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

OSA is MIOSA's filesystem-first framework for agent operating environments.

Package: `@miosa/osa`

Repository: `Miosa-osa/osa-framework`

An OSA Project packages instructions, tools, skills, docs, connections,
channels, schedules, evals, permissions, subagents, and Computers into one
inspectable directory.

```text
my-agent/
  osa/
    AGENTS.md
    agent.yml
    instructions.md
    permissions.yml
    computers/
    connections/
    channels/
    schedules/
    docs/
    evals/
    skills/
    subagents/
    tools/
```

## Quick Start

```bash
npx @miosa/osa init my-agent
cd my-agent
npx @miosa/osa info
npx @miosa/osa build
```

Then run or deploy it through the MIOSA CLI:

```bash
miosa osa publish --workspace <workspace-id>
miosa osa deploy --workspace <workspace-id> --wait
miosa osa run "inspect this repo" --sandbox <sandbox-id>
miosa osa run "validate the browser workflow" --computer <computer-id>
```

## Why OSA

Filesystem-first agents are easier to inspect, review, test, and operate. OSA
uses that authoring model, but targets MIOSA's platform primitives:

- Computers and browser-capable desktop automation
- OpenComputers and BYOC runtime targets
- Persistent sandboxes and workspace state
- Durable deployment records through `miosa osa deploy`
- Skills, tools, subagents, schedules, channels, evals, docs, and approvals
- White-label platform deployments where the agent runs inside customer-facing products

## Commands

```bash
osa init [target]
osa init [target] --template repo-maintainer
osa info [target]
osa build [target]
osa skills [target]
osa docs
osa templates
```

`osa docs` prints the bundled documentation path. Coding agents can read those
files from `node_modules/@miosa/osa/docs` after installation.

## Examples

Real examples live in [`examples/`](examples):

- [`examples/clinic-ops-agent`](examples/clinic-ops-agent): operational support agent with browser QA, schedule, GitHub/MCP connection, approvals, and a specialist investigator subagent.
- [`examples/browser-qa-agent`](examples/browser-qa-agent): focused browser workflow QA agent using MIOSA Computer capabilities.
- [`examples/repo-maintainer-agent`](examples/repo-maintainer-agent): engineering agent for PR review, CI triage, release notes, and issue maintenance.
- [`examples/deployment-operator-agent`](examples/deployment-operator-agent): production rollout, smoke check, rollback, and incident handoff agent.

Built-in templates:

- `default`
- `browser-qa`
- `clinic-ops`
- `repo-maintainer`
- `deployment-operator`

## Library

```js
import { initProject, inspectProject, buildProject } from "@miosa/osa";

await initProject("my-agent");
const project = inspectProject("my-agent");
const build = buildProject("my-agent");
```

## Status

This package is the standalone framework authoring surface. Runtime dispatch,
tenant auth, Computer execution, and deployment are provided by the MIOSA
platform and the `miosa` CLI.
