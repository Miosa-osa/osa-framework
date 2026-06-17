# OSA

OSA is MIOSA's filesystem-first framework for agent operating environments.

Package: `@miosa/osa`
Repository: `Miosa-osa/osa-framework`

An OSA Project packages instructions, tools, skills, docs, connections, channels,
evals, permissions, and Computers into one inspectable directory:

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
```

Then run it through the MIOSA CLI:

```bash
miosa osa run "inspect this repo" --sandbox <sandbox-id>
miosa osa run "validate the browser workflow" --computer <computer-id>
```

## Why This Exists

Vercel Eve makes agents easy to understand by making the filesystem the authoring
surface. OSA uses the same inspectable project idea, but targets MIOSA's operating
platform: Computers, OpenComputers, persistent workspaces, white-label
deployments, and BYOC runtime targets.

## Status

This package is the standalone framework surface. Runtime dispatch, tenant auth,
Computer execution, and deployment live in the MIOSA platform and `miosa` CLI.

## Commands

```bash
osa init [target]
osa info [target]
osa build [target]
osa skills [target]
```

## Library

```js
import { initProject, inspectProject, buildProject } from "@miosa/osa";

await initProject("my-agent");
const project = inspectProject("my-agent");
const build = buildProject("my-agent");
```
