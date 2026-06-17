# Deployment Operator Agent

This example handles rollout readiness, smoke checks, rollback handoff, and
incident notes.

```bash
npm install
npm run build:osa
miosa osa deploy --workspace <workspace-id> --wait
```
