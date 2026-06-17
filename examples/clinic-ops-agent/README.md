# Clinic Ops Agent

This example models a white-label operational support agent for a clinic
platform. It can inspect product docs, run browser QA, create support summaries,
and escalate risky actions through approval policy.

Try it:

```bash
npm install
npm run build:osa
```

Then publish through the MIOSA CLI from this directory:

```bash
miosa osa publish --workspace <workspace-id>
miosa osa deploy --workspace <workspace-id> --wait
```
