# OSA Framework

[![CI](https://github.com/Miosa-osa/osa-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/Miosa-osa/osa-framework/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@miosa/osa.svg)](https://www.npmjs.com/package/@miosa/osa)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

OSA is a filesystem-first framework for making your own agents on MIOSA.

Package: `@miosa/osa`

Repository: `Miosa-osa/osa-framework`

## Standard Start

One file is enough:

```text
my-agent/
  agent/
    instructions.md
```

Create it:

```bash
npx @miosa/osa init my-agent
cd my-agent
```

Write what your agent should do:

```md
# Instructions

You are a customer research agent.

Find primary sources, summarize the important facts, and ask for approval before
contacting anyone or changing external systems.
```

Build the manifest:

```bash
npx @miosa/osa build
```

That is the standard path. Add tools, skills, subagents, schedules, channels,
Computers, docs, and evals only when the agent actually needs them.

Read the full standard: [`docs/standard.md`](docs/standard.md).

## Grow The Agent

When the one-file agent needs more structure, keep growing the `agent/` directory:

```text
my-agent/
  agent/
    AGENTS.md
    agent.ts
    instructions.md
    permissions.yml
    computers/
    connections/
    channels/
    schedules/
    docs/
    skills/
    subagents/
    tools/
  evals/
```

Use templates when you want a prepared shape:

```bash
npx @miosa/osa init my-agent --template full
npx @miosa/osa init browser-agent --template browser-qa
npx @miosa/osa init repo-agent --template repo-maintainer
npx @miosa/osa init deploy-agent --template deployment-operator
```

List templates:

```bash
npx @miosa/osa templates
```

## Run Or Deploy On MIOSA

After building, use the MIOSA CLI:

```bash
miosa osa publish --workspace <workspace-id>
miosa osa deploy --workspace <workspace-id> --wait
miosa osa run "inspect this repo" --sandbox <sandbox-id>
miosa osa run "validate the browser workflow" --computer <computer-id>
```

## Why OSA

Filesystem-first agents are easier to inspect, review, test, and operate. OSA
uses that authoring model, but targets MIOSA platform primitives:

- Computers and browser-capable desktop automation
- OpenComputers and BYOC runtime targets
- Persistent sandboxes and workspace state
- Durable deployment records through `miosa osa deploy`
- Skills, tools, subagents, schedules, channels, root-level evals, docs, and approvals
- White-label deployments where the agent runs inside customer-facing products

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

## Standards

Read [`docs/standards.md`](docs/standards.md) before publishing a serious OSA
project. It defines the expected bar for instructions, tools, skills, subagents,
permissions, evals, schedules, channels, examples, and deployment readiness.

## Examples

Real examples live in [`examples/`](examples):

- [`examples/minimal-agent`](examples/minimal-agent): the one-file starter example for people making their own agent.
- [`examples/standard-agent`](examples/standard-agent): full standard weather agent with instructions, model config, skill, tool, sandbox, channel, connection, subagent, schedule, and eval.
- [`examples/browser-qa-agent`](examples/browser-qa-agent): focused browser workflow QA agent using MIOSA Computer capabilities.
- [`examples/clinic-ops-agent`](examples/clinic-ops-agent): operational support agent with browser QA, schedule, GitHub/MCP connection, approvals, and a specialist investigator subagent.
- [`examples/repo-maintainer-agent`](examples/repo-maintainer-agent): engineering agent for PR review, CI triage, release notes, and issue maintenance.
- [`examples/deployment-operator-agent`](examples/deployment-operator-agent): production rollout, smoke check, rollback, and incident handoff agent.

Built-in templates:

- `standard`
- `full`
- `browser-qa`
- `clinic-ops`
- `repo-maintainer`
- `deployment-operator`

Compatibility alias: `default` maps to `standard`.

Legacy compatibility: existing projects with `osa/` still inspect and build,
but new projects should use `agent/`.

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
