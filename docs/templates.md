# Templates

OSA ships built-in templates for common production agent shapes.

```bash
osa templates
osa init ./repo-agent --template repo-maintainer
osa init ./deploy-agent --template deployment-operator
```

## Available Templates

| Template | Use When |
| --- | --- |
| `standard` | You want a minimal agent without extra tools, channels, schedules, or subagents. |
| `full` | You want every OSA slot scaffolded with neutral defaults. |
| `browser-qa` | You need browser workflow validation with MIOSA Computers. |
| `clinic-ops` | You need white-label support operations with approval boundaries. |
| `repo-maintainer` | You need code review, CI triage, issue cleanup, and release notes. |
| `deployment-operator` | You need rollouts, smoke checks, rollback handoff, and incident notes. |

Templates are normal OSA projects. After scaffolding, inspect the files, edit
them, and run `osa build`.

`default` is kept as a compatibility alias for `standard`.
