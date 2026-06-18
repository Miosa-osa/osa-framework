# OSA Project Layout

OSA Projects are filesystem-defined agent operating environments. The smallest
valid project is:

```text
agent/
  instructions.md
```

The recommended full layout is:

```text
my-agent/
  package.json
  agent/
    agent.ts
    AGENTS.md
    instructions.md
    permissions.yml
    instrumentation.ts
    channels/
    computers/
    connections/
    hooks/
    skills/
    lib/
    sandbox/
    schedules/
    subagents/
    tools/
  evals/
```

## Naming Rule

Identity comes from the path when possible:

| Path | Resolves To |
| --- | --- |
| `agent/tools/create_ticket_summary.ts` | tool `create_ticket_summary` |
| `agent/connections/linear.ts` | connection `linear` |
| `agent/skills/support-triage/SKILL.md` | skill `support-triage` |
| `agent/subagents/investigator/agent.ts` | subagent `investigator` |
| `evals/support-summary.yml` | eval `support-summary` |

The root agent name comes from `package.json` `name`, falling back to the
project directory name. Legacy `agent/agent.yml` may still override name and
description for older projects.

## Slots

| Path | Purpose |
| --- | --- |
| `agent/instructions.md` | Required base system instructions. |
| `agent/agent.ts` | Optional agent operating profile: model routing, harness, runtime, sandbox, and policy. |
| `agent/AGENTS.md` | Always-needed operating context for coding agents. |
| `agent/permissions.yml` | File, network, secret, tool, and Computer policy. |
| `agent/computers/` | MIOSA Computer profiles for browser or desktop work. |
| `agent/connections/` | MCP, OpenAPI, or service connection descriptors. |
| `agent/channels/` | Web, Slack, GitHub, API, or product event surfaces. |
| `agent/hooks/` | Lifecycle hooks and stream-event subscribers. |
| `agent/docs/` | Reference material the agent actually needs. |
| `agent/skills/` | Load-on-demand procedures and capability packs. |
| `agent/subagents/` | Specialist child agents with their own instructions. |
| `agent/tools/` | Typed executable integrations. |
| `agent/schedules/` | Recurring jobs and autonomous prompts. |
| `agent/sandbox/` | Workspace seed files and sandbox customization. |
| `evals/` | Project-level repeatable behavior checks. |

## Compatibility

New projects should use `agent/`. Existing projects with `osa/` are still
supported as a legacy authored surface so current users do not have to migrate
immediately.

## Runtime Profile

`agent/agent.ts` is the bridge between the filesystem contract and MIOSA
execution. Keep the axes separate:

- `model`: model provider routing and fallback.
- `harness`: execution engine such as `auto`, `codex`, `claude-code`,
  `hermes`, `osa`, or `custom`.
- `runtime`: deployment target, durability, checkpointing, and streaming.
- `sandbox`: compute backend such as `miosa-computer`, `miosa-sandbox`,
  `local-docker`, or `byoc`.
- `policy`: approvals, network posture, and side-effect controls.

The manifest stores the compiled profile as `runtimeProfile` so MIOSA can plan
the concrete execution packet without scraping arbitrary source files.
