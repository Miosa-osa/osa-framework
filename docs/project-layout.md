# OSA Project Layout

OSA Projects are filesystem-defined agent operating environments. The smallest
valid project is:

```text
agent/
  instructions.md
```

Use the richer `osa/` layout when you want explicit project slots:

```text
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

## Slots

| Path | Purpose |
|---|---|
| `agent/instructions.md` | One-file starter for simple agents. |
| `AGENTS.md` | Always-needed operating context. |
| `agent.yml` | Agent identity and runtime defaults. |
| `instructions.md` | Base system instructions. |
| `permissions.yml` | File, network, secret, tool, and Computer policy. |
| `computers/` | Computer profiles. |
| `connections/` | MCP/OpenAPI connection descriptors. |
| `channels/` | Web, Slack, GitHub, API channel descriptors. |
| `docs/` | Reference material. |
| `evals/` | Repeatable behavior checks. |
| `skills/` | Load-on-demand procedures. |
| `subagents/` | Specialist child agents. |
| `tools/` | Execution tools. |
