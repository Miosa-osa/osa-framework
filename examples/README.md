# Examples

These examples show real OSA project shapes. They are not required starting
points. For a clean project, run:

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
| [`browser-qa-agent`](browser-qa-agent) | Browser workflow QA with MIOSA Computer capabilities. |
| [`clinic-ops-agent`](clinic-ops-agent) | White-label support operations with approvals and browser QA. |
| [`repo-maintainer-agent`](repo-maintainer-agent) | PR review, CI triage, release notes, and issue maintenance. |
| [`deployment-operator-agent`](deployment-operator-agent) | Rollouts, smoke checks, rollback handoff, and incident notes. |

## Quality Bar

Each example should:

- Build with `osa build`
- Include specific instructions
- Include at least one eval
- Use approval boundaries for risky work
- Include schemas for tools
- Explain when to use the example

See [`../docs/standards.md`](../docs/standards.md) for the full standard.
