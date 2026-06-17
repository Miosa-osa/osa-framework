# Public Repository Plan

Target future repository:

```text
github.com/Miosa-osa/osa-framework
```

Package:

```text
@miosa/osa
```

CLI:

```text
osa
```

## Split Criteria

Split this package into its own public repo after:

1. `miosa osa run --sandbox` and `miosa osa run --computer` are backed by production Agent Runs.
2. OSA manifests are accepted by the backend as a stable contract.
3. At least one Computer-backed OSA skill works end-to-end.
4. Docs explain how this differs from Eve: Computers, OpenComputers, persistent workspaces, BYOC, and white-label deploy.
5. CI runs framework tests and package validation.

## Repo Shape

```text
osa/
  packages/osa/
  examples/basic-agent/
  examples/browser-qa/
  docs/
  README.md
  LICENSE
```
