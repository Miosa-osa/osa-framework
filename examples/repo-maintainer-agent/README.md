# Repo Maintainer Agent

This example is a serious engineering maintenance agent. It can review PRs,
triage CI failures, prepare release notes, and produce issue maintenance reports.

```bash
npm install
npm run build:osa
miosa osa run "review this branch" --sandbox <sandbox-id>
```
