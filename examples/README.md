# Examples

These examples show real OSA project shapes. They are not required starting
points. For a clean one-file project, run:

```bash
npx @miosa/osa init my-agent
```

That writes only:

```text
agent/instructions.md
```

Use examples when you want to study a fuller pattern.

## Available Examples

| Example | Purpose |
| --- | --- |
| [`minimal-agent`](minimal-agent) | One-file starter for making your own agent from scratch. |
| [`standard-agent`](standard-agent) | Full standard agent showing instructions, model config, skills, tools, sandbox, channels, connections, subagents, schedules, and evals. |
| [`browser-qa-agent`](browser-qa-agent) | Browser workflow QA with MIOSA Computer capabilities. |
| [`clinic-ops-agent`](clinic-ops-agent) | White-label support operations with approvals and browser QA. |
| [`repo-maintainer-agent`](repo-maintainer-agent) | PR review, CI triage, release notes, and issue maintenance. |
| [`deployment-operator-agent`](deployment-operator-agent) | Rollouts, smoke checks, rollback handoff, and incident notes. |

## Quality Bar

`minimal-agent` is intentionally one file. Richer examples should:

- Build with `osa build`
- Include specific instructions
- Include at least one eval
- Use approval boundaries for risky work
- Include schemas for tools
- Include sandbox, channel, connection, subagent, and schedule examples when
  claiming to be standard
- Explain when to use the example

See [`../docs/standards.md`](../docs/standards.md) for the full standard.
